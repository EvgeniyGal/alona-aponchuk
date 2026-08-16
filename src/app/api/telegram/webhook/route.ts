import { NextResponse } from "next/server";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { authTokens, users } from "@/lib/db/schema";
import { hashToken } from "@/lib/auth/tokens";
import { sendTelegramMessage } from "@/lib/notify/telegram";

type TelegramUpdate = {
  message?: {
    chat: { id: number; type: string };
    from?: { id: number; username?: string };
    text?: string;
  };
};

const REFUSAL =
  "This bot is for registered Aponchuk admins. Connect it from the Admin panel Notifications page.";

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const header = request.headers.get("x-telegram-bot-api-secret-token");
  if (!secret || header !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = (await request.json()) as TelegramUpdate;
  const message = update.message;
  if (!message?.text) return NextResponse.json({ ok: true });

  const chatId = String(message.chat.id);
  const telegramUserId = String(message.from?.id ?? message.chat.id);
  const username = message.from?.username ?? null;
  const text = message.text.trim();

  if (message.chat.type !== "private") {
    return NextResponse.json({ ok: true });
  }

  const db = getDb();

  if (text === "/unlink") {
    const [linked] = await db.select().from(users).where(eq(users.telegramUserId, telegramUserId)).limit(1);
    if (linked) {
      await db
        .update(users)
        .set({
          telegramUserId: null,
          telegramChatId: null,
          telegramUsername: null,
          telegramLinkedAt: null,
        })
        .where(eq(users.id, linked.id));
      await sendTelegramMessage(chatId, "Telegram has been disconnected from your admin account.");
    } else {
      await sendTelegramMessage(chatId, REFUSAL);
    }
    return NextResponse.json({ ok: true });
  }

  if (text.startsWith("/start")) {
    const token = text.replace("/start", "").trim();
    if (!token) {
      await sendTelegramMessage(chatId, REFUSAL);
      return NextResponse.json({ ok: true });
    }

    const tokenHash = hashToken(token);
    const [record] = await db
      .select()
      .from(authTokens)
      .where(
        and(
          eq(authTokens.purpose, "telegram_link"),
          eq(authTokens.tokenHash, tokenHash),
          isNull(authTokens.usedAt),
          gt(authTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!record?.userId) {
      await sendTelegramMessage(chatId, "That connect code expired. Generate a new one from the Admin panel.");
      return NextResponse.json({ ok: true });
    }

    const [adminUser] = await db.select().from(users).where(eq(users.id, record.userId)).limit(1);
    if (!adminUser?.approved) {
      await sendTelegramMessage(chatId, REFUSAL);
      return NextResponse.json({ ok: true });
    }

    const [taken] = await db.select().from(users).where(eq(users.telegramUserId, telegramUserId)).limit(1);
    if (taken && taken.id !== adminUser.id) {
      await sendTelegramMessage(chatId, "This Telegram account is already linked to another admin user.");
      return NextResponse.json({ ok: true });
    }

    await db
      .update(users)
      .set({
        telegramUserId,
        telegramChatId: chatId,
        telegramUsername: username,
        telegramLinkedAt: new Date(),
      })
      .where(eq(users.id, adminUser.id));

    await db.update(authTokens).set({ usedAt: new Date() }).where(eq(authTokens.id, record.id));
    await sendTelegramMessage(chatId, "Linked. You will receive lead alerts here. Send /unlink to disconnect.");
    return NextResponse.json({ ok: true });
  }

  const [linked] = await db.select().from(users).where(eq(users.telegramUserId, telegramUserId)).limit(1);
  if (!linked?.approved) {
    await sendTelegramMessage(chatId, REFUSAL);
  }
  return NextResponse.json({ ok: true });
}
