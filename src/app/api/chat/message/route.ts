import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { chatMessages, chatSessions } from "@/lib/db/schema";
import { processTurn, type IncomingMessage } from "@/lib/chat/engine";
import { getOrCreateChatSession, publicMessage, visitorIdFromRequest } from "@/lib/chat/session";
import { newId } from "@/lib/id";
import { rateLimit } from "@/lib/rate-limit";

const payloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("cta"),
    value: z.enum(["start_assessment", "ask_question", "learn_services", "pass_to_alona", "restart"]),
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
    const { session, messages } = await getOrCreateChatSession(visitorIdFromRequest(request));
    const limited = rateLimit(`chat:${session.id}`, 40, 10 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { ok: false, error: "Please wait a moment before sending another message." },
        { status: 429 },
      );
    }

    const parsed = payloadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid message." }, { status: 400 });
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
      { ok: false, error: "The assistant could not process that message." },
      { status: 500 },
    );
  }
}
