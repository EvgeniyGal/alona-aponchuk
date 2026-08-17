"use server";

import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { authTokens, notificationSettings, users } from "@/lib/db/schema";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { newId } from "@/lib/id";
import { MAX_TELEGRAM_RECIPIENTS, getExtraTelegramRecipients, removeExtraTelegramRecipient, TELEGRAM_RECIPIENT_INVITE_EMAIL } from "@/lib/notify/settings";
import { listTelegramRecipientViews } from "@/lib/notify/telegram-recipients";
import { connectDeepLink, getTelegramWebhookStatus, sendTelegramMessage } from "@/lib/notify/telegram";

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
    linkedAt: user.telegramLinkedAt?.toISOString() ?? null,
    recipients: await listTelegramRecipientViews(user.id),
  };
}

export async function fetchTelegramWebhookStatus() {
  await requireAdmin();
  return getTelegramWebhookStatus();
}

async function createLinkToken(userId: string, email: string) {
  const db = getDb();
  await db
    .update(authTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(authTokens.userId, userId), eq(authTokens.purpose, "telegram_link"), eq(authTokens.email, email), isNull(authTokens.usedAt)));
  const token = generateToken(18);
  await db.insert(authTokens).values({
    id: newId(),
    userId,
    email,
    purpose: "telegram_link",
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  return connectDeepLink(token);
}

export async function createTelegramLink() {
  const user = await requireAdmin();
  const url = await createLinkToken(user.id, user.email);
  revalidatePath("/admin/notifications");
  return url;
}

export async function createTelegramRecipientLink() {
  const user = await requireAdmin();
  const recipients = await listTelegramRecipientViews(user.id);
  if (recipients.filter((item) => item.source === "extra").length >= MAX_TELEGRAM_RECIPIENTS) {
    throw new Error(`You can add up to ${MAX_TELEGRAM_RECIPIENTS} extra Telegram accounts.`);
  }
  const url = await createLinkToken(user.id, TELEGRAM_RECIPIENT_INVITE_EMAIL);
  revalidatePath("/admin/notifications");
  return url;
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

export async function disconnectTelegramRecipient(telegramUserId: string) {
  const user = await requireAdmin();
  if (!telegramUserId) throw new Error("Missing Telegram user.");

  if (user.telegramUserId === telegramUserId) {
    await disconnectTelegram();
    return;
  }

  await removeExtraTelegramRecipient(telegramUserId);
  revalidatePath("/admin/notifications");
}

export async function sendTestTelegramAlert() {
  const user = await requireAdmin();
  const db = getDb();
  const [admins, extras] = await Promise.all([
    db
      .select({ telegramChatId: users.telegramChatId })
      .from(users)
      .where(and(eq(users.approved, true), isNotNull(users.telegramChatId))),
    getExtraTelegramRecipients(),
  ]);

  const chatIds = new Set<string>();
  for (const recipient of admins) {
    if (recipient.telegramChatId) chatIds.add(recipient.telegramChatId);
  }
  for (const recipient of extras) {
    if (recipient.telegramChatId) chatIds.add(recipient.telegramChatId);
  }

  if (chatIds.size === 0) {
    throw new Error("No Telegram accounts are connected yet.");
  }

  const text = `Test alert from ${user.email}. New workflow audit and assessment leads will be sent here.`;
  for (const chatId of chatIds) {
    await sendTelegramMessage(chatId, text);
  }
  return { sent: chatIds.size };
}
