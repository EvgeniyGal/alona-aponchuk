import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { chatMessages, chatSessions } from "@/lib/db/schema";
import { processTurn, type IncomingMessage } from "@/lib/chat/engine";
import { getOrCreateChatSession, localeFromRequest, publicMessage, visitorIdFromRequest } from "@/lib/chat/session";
import { getChatCatalog } from "@/i18n/catalog";
import { parseAppLocale } from "@/i18n/config";
import { newId } from "@/lib/id";
import { rateLimit } from "@/lib/rate-limit";

const payloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("cta"),
    value: z.enum([
      "start_assessment",
      "continue_assessment",
      "pause_assessment",
      "ask_question",
      "learn_services",
      "pass_to_alona",
      "restart",
    ]),
  }),
  z.object({
    type: z.literal("select"),
    step: z.string().min(1).max(40),
    value: z.string().min(1).max(200),
  }),
  z.object({
    type: z.literal("multi_done"),
    step: z.string().min(1).max(40),
    values: z.array(z.string().min(1).max(80)).min(1).max(3),
  }),
  z.object({
    type: z.literal("text"),
    value: z.string().trim().min(1).max(2000),
  }),
]);

export async function POST(request: Request) {
  try {
    const locale = localeFromRequest(request);
    const chat = getChatCatalog(locale);
    const { session, messages } = await getOrCreateChatSession(visitorIdFromRequest(request), locale);
    const limited = rateLimit(`chat:${session.id}`, 40, 10 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { ok: false, error: chat.rateLimit },
        { status: 429 },
      );
    }

    const parsed = payloadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: chat.invalid }, { status: 400 });
    }

    const history = messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({
        role: message.role as "user" | "assistant",
        content: message.content,
      }));

    const result = await processTurn(
      {
        mode: session.mode,
        assessmentStep: session.assessmentStep,
        assessmentAnswers: session.assessmentAnswers,
        pendingOtherField: session.pendingOtherField,
        locale: parseAppLocale(session.locale),
      },
      history,
      parsed.data as IncomingMessage,
    );

    const db = getDb();
    const inserted = [];
    for (const message of result.messages) {
      const row = {
        id: newId(),
        sessionId: session.id,
        role: message.role,
        content: message.content,
        ui: message.ui ?? null,
        createdAt: new Date(),
      };
      await db.insert(chatMessages).values(row);
      inserted.push(row);
    }

    await db
      .update(chatSessions)
      .set({
        mode: result.session.mode,
        assessmentStep: result.session.assessmentStep,
        assessmentAnswers: result.session.assessmentAnswers,
        pendingOtherField: result.session.pendingOtherField,
        locale: result.session.locale,
        updatedAt: new Date(),
      })
      .where(eq(chatSessions.id, session.id));

    return NextResponse.json({
      ok: true,
      messages: inserted.map(publicMessage),
      mode: result.session.mode,
    });
  } catch (error) {
    console.error("[chat/message]", error);
    return NextResponse.json(
      { ok: false, error: getChatCatalog(localeFromRequest(request)).processError },
      { status: 500 },
    );
  }
}
