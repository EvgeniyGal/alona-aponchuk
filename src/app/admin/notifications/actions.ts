"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { authTokens, notificationSettings, users } from "@/lib/db/schema";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { newId } from "@/lib/id";
import { connectDeepLink, getTelegramWebhookStatus } from "@/lib/notify/telegram";

const emailSchema = z.string().trim().email().max(200);

function normalizeLeadEmails(values: FormDataEntryValue[]) {
  const seen = new Set<string>();
  const emails: string[] = [];

  for (const value of values) {
    const email = String(value).trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return { ok: false as const, error: `"${email}" is not a valid email address.` };
    seen.add(parsed.data);
    emails.push(parsed.data);
  }

  if (emails.length === 0) {
    return { ok: false as const, error: "Add at least one email address." };
  }

  if (emails.length > 10) {
    return { ok: false as const, error: "You can add up to 10 notification emails." };
  }

  return { ok: true as const, emails };
}

export async function saveLeadNotificationEmails(formData: FormData) {
  await requireAdmin();
  const normalized = normalizeLeadEmails(formData.getAll("leadEmails"));
  if (!normalized.ok) return normalized;

  const db = getDb();
  const now = new Date();
  const [existing] = await db
    .select({ id: notificationSettings.id })
    .from(notificationSettings)
    .where(eq(notificationSettings.id, "default"))
    .limit(1);

  if (existing) {
    await db
      .update(notificationSettings)
      .set({ leadEmails: normalized.emails, updatedAt: now })
      .where(eq(notificationSettings.id, "default"));
  } else {
    await db.insert(notificationSettings).values({
      id: "default",
      leadEmails: normalized.emails,
      updatedAt: now,
    });
  }

  revalidatePath("/admin/notifications");
  return { ok: true as const, leadEmails: normalized.emails };
}

export async function getTelegramLinkStatus() {
  const user = await requireAdmin();
  return {
    linked: Boolean(user.telegramChatId),
    username: user.telegramUsername,
  };
}

export async function fetchTelegramWebhookStatus() {
  await requireAdmin();
  return getTelegramWebhookStatus();
}

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
