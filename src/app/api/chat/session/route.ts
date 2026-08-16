import { NextResponse } from "next/server";
import { getOrCreateChatSession, publicMessage, publicSession } from "@/lib/chat/session";

export async function GET() {
  try {
    const { session, messages } = await getOrCreateChatSession();
    return NextResponse.json({
      ok: true,
      session: publicSession(session),
      messages: messages.map(publicMessage),
    });
  } catch (error) {
    console.error("[chat/session]", error);
    return NextResponse.json(
      { ok: false, error: "The assistant is temporarily unavailable." },
      { status: 500 },
    );
  }
}
