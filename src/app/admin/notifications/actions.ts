"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { authTokens, users } from "@/lib/db/schema";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { newId } from "@/lib/id";
import { connectDeepLink } from "@/lib/notify/telegram";

export async function createTelegramLink() {
  const user = await requireAdmin();
  const db = getDb();
  await db
    .update(authTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(authTokens.userId, user.id), eq(authTokens.purpose, "telegram_link"), isNull(authTokens.usedAt)));
  const token = generateToken(18);
  await db.insert(authTokens).values({
    id: newId(),
    userId: user.id,
    email: user.email,
    purpose: "telegram_link",
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  revalidatePath("/admin/notifications");
  return connectDeepLink(token);
}

export async function disconnectTelegram() {
  const user = await requireAdmin();
  const db = getDb();
  await db
    .update(users)
    .set({
      telegramUserId: null,
      telegramChatId: null,
      telegramUsername: null,
      telegramLinkedAt: null,
    })
    .where(eq(users.id, user.id));
  revalidatePath("/admin/notifications");
}
