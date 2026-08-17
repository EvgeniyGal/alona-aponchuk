import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { chatMessages, chatSessions, type ChatMessage, type ChatSession } from "@/lib/db/schema";
import { newId } from "@/lib/id";
import { welcomeMessages } from "@/lib/chat/engine";
import { defaultLocale, parseAppLocale, type AppLocale } from "@/i18n/config";

export const SESSION_COOKIE = "chat_session_id";
export const VISITOR_HEADER = "x-chat-visitor-id";
export const LOCALE_HEADER = "x-chat-locale";

const VISITOR_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseVisitorId(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim();
  return VISITOR_ID_PATTERN.test(trimmed) ? trimmed : null;
}

export function visitorIdFromRequest(request: Request) {
  return parseVisitorId(request.headers.get(VISITOR_HEADER));
}

export function localeFromRequest(request: Request): AppLocale {
  return parseAppLocale(request.headers.get(LOCALE_HEADER));
}

async function backfillVisitorId(session: ChatSession, visitorId: string | null) {
  if (!visitorId || session.visitorId) return session;

  const db = getDb();
  const now = new Date();
  await db
    .update(chatSessions)
    .set({ visitorId, updatedAt: now })
    .where(eq(chatSessions.id, session.id));

  return { ...session, visitorId, updatedAt: now };
}

async function insertWelcome(sessionId: string, locale: AppLocale) {
  const db = getDb();
  const welcome = welcomeMessages(locale);
  const inserted: ChatMessage[] = [];
  for (const message of welcome) {
    const row = {
      id: newId(),
      sessionId,
      role: message.role,
      content: message.content,
      ui: message.ui ?? null,
      createdAt: new Date(),
    };
    await db.insert(chatMessages).values(row);
    inserted.push(row);
  }
  return inserted;
}

async function syncSessionLocale(session: ChatSession, messages: ChatMessage[], locale: AppLocale) {
  if (parseAppLocale(session.locale) === locale) {
    return { session, messages };
  }

  const db = getDb();
  const now = new Date();
  await db
    .update(chatSessions)
    .set({ locale, updatedAt: now })
    .where(eq(chatSessions.id, session.id));

  const nextSession = { ...session, locale, updatedAt: now };
  const hasUserMessage = messages.some((message) => message.role === "user");
  if (hasUserMessage || session.mode !== "welcome") {
    return { session: nextSession, messages };
  }

  await db.delete(chatMessages).where(eq(chatMessages.sessionId, session.id));
  const inserted = await insertWelcome(session.id, locale);
  return { session: nextSession, messages: inserted };
}

export async function getOrCreateChatSession(visitorId?: string | null, locale: AppLocale = defaultLocale) {
  const parsedVisitorId = parseVisitorId(visitorId ?? null);
  const resolvedLocale = parseAppLocale(locale);
  const jar = await cookies();
  const existingId = jar.get(SESSION_COOKIE)?.value;
  const db = getDb();

  if (existingId) {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, existingId)).limit(1);
    if (session) {
      const linkedSession = await backfillVisitorId(session, parsedVisitorId);
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, linkedSession.id))
        .orderBy(chatMessages.createdAt);
      return syncSessionLocale(linkedSession, messages, resolvedLocale);
    }
  }

  const id = newId();
  const now = new Date();
  await db.insert(chatSessions).values({
    id,
    visitorId: parsedVisitorId,
    locale: resolvedLocale,
    mode: "welcome",
    assessmentAnswers: {},
    createdAt: now,
    updatedAt: now,
  });

  const inserted = await insertWelcome(id, resolvedLocale);

  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id)).limit(1);
  return { session: session!, messages: inserted };
}

export function publicMessage(message: ChatMessage) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    ui: message.ui,
    createdAt: message.createdAt,
  };
}

export function publicSession(session: ChatSession) {
  return {
    id: session.id,
    mode: session.mode,
    assessmentStep: session.assessmentStep,
    leadId: session.leadId,
    visitorId: session.visitorId,
    locale: session.locale,
  };
}
