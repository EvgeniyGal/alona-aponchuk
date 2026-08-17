import { NextResponse } from "next/server";
import { getOrCreateChatSession, localeFromRequest, publicMessage, publicSession, visitorIdFromRequest } from "@/lib/chat/session";
import { getChatCatalog } from "@/i18n/catalog";

export async function GET(request: Request) {
  try {
    const { session, messages } = await getOrCreateChatSession(
      visitorIdFromRequest(request),
      localeFromRequest(request),
    );
    return NextResponse.json({
      ok: true,
      session: publicSession(session),
      messages: messages.map(publicMessage),
    });
  } catch (error) {
    console.error("[chat/session]", error);
    return NextResponse.json(
      { ok: false, error: getChatCatalog(localeFromRequest(request)).unavailable },
      { status: 500 },
    );
  }
}
