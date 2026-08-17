import { NextResponse } from "next/server";
import { getOrCreateChatSession, publicMessage, publicSession, visitorIdFromRequest } from "@/lib/chat/session";

export async function GET(request: Request) {
  try {
    const { session, messages } = await getOrCreateChatSession(visitorIdFromRequest(request));
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
