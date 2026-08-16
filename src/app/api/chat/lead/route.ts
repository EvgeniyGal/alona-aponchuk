import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { chatMessages, chatSessions, leads } from "@/lib/db/schema";
import { getOrCreateChatSession } from "@/lib/chat/session";
import { newId } from "@/lib/id";
import { notifyNewLead } from "@/lib/notify/leads";
import { rateLimit } from "@/lib/rate-limit";

const leadSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  organizationName: z.string().trim().min(1).max(200),
  workEmail: z.string().trim().email().max(200),
  phone: z.string().trim().max(60).optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  roleTitle: z.string().trim().max(200).optional().default(""),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const { session, messages } = await getOrCreateChatSession();
    const limited = rateLimit(`lead:${session.id}`, 5, 60 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json({ ok: false, error: "This assessment was already submitted." }, { status: 429 });
    }

    if (session.leadId) {
      return NextResponse.json({ ok: true, alreadySubmitted: true });
    }

    const parsed = leadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Please complete the required contact fields." }, { status: 400 });
    }

    const diagnostic = [...messages].reverse().find((message) => message.role === "assistant" && !message.ui)?.content;
    const roleFromAssessment = session.assessmentAnswers.role;
    const roleTitle =
      parsed.data.roleTitle ||
      (typeof roleFromAssessment?.label === "string" ? roleFromAssessment.label : "") ||
      "";

    const db = getDb();
    const id = newId();
    const now = new Date();
    const [lead] = await db
      .insert(leads)
      .values({
        id,
        source: "chat_assessment",
        status: "new",
        fullName: parsed.data.fullName,
        organizationName: parsed.data.organizationName,
        workEmail: parsed.data.workEmail.toLowerCase(),
        phone: parsed.data.phone,
        website: parsed.data.website,
        roleTitle,
        consentAt: now,
        assessmentAnswers: session.assessmentAnswers,
        diagnosticSummary: diagnostic ?? null,
        transcript: messages.map((message) => ({
          role: message.role,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
        })),
        sessionId: session.id,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await db
      .update(chatSessions)
      .set({ leadId: id, mode: "done", updatedAt: now })
      .where(eq(chatSessions.id, session.id));

    const thanks = {
      id: newId(),
      sessionId: session.id,
      role: "assistant",
      content:
        "Thank you. Alona will review this and follow up at the email you provided. You can also reach Aponchuk Workflow Systems at info@aponchukworkflow.com.",
      ui: null,
      createdAt: now,
    };
    await db.insert(chatMessages).values(thanks);

    if (lead) {
      void notifyNewLead(lead).catch((error) => console.error("[chat/lead] notify", error));
    }

    return NextResponse.json({
      ok: true,
      message: {
        id: thanks.id,
        role: thanks.role,
        content: thanks.content,
        ui: null,
        createdAt: thanks.createdAt,
      },
    });
  } catch (error) {
    console.error("[chat/lead]", error);
    return NextResponse.json(
      { ok: false, error: "We could not save your details. Please email info@aponchukworkflow.com." },
      { status: 500 },
    );
  }
}
