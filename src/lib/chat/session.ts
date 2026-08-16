import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { chatMessages, chatSessions, type ChatMessage, type ChatSession } from "@/lib/db/schema";
import { newId } from "@/lib/id";
import { welcomeMessages } from "@/lib/chat/engine";

export const SESSION_COOKIE = "chat_session_id";

export async function getOrCreateChatSession() {
  const jar = await cookies();
  const existingId = jar.get(SESSION_COOKIE)?.value;
  const db = getDb();

  if (existingId) {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, existingId)).limit(1);
    if (session) {
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, session.id))
        .orderBy(chatMessages.createdAt);
      return { session, messages };
    }
  }

  const id = newId();
  const now = new Date();
  await db.insert(chatSessions).values({
    id,
    mode: "welcome",
    assessmentAnswers: {},
    createdAt: now,
    updatedAt: now,
  });

  const welcome = welcomeMessages();
  const inserted: ChatMessage[] = [];
  for (const message of welcome) {
    const row = {
      id: newId(),
      sessionId: id,
      role: message.role,
      content: message.content,
      ui: message.ui ?? null,
      createdAt: new Date(),
    };
    await db.insert(chatMessages).values(row);
    inserted.push(row);
  }

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
  };
}
