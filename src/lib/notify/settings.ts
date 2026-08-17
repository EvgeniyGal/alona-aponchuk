import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { notificationSettings, type TelegramRecipient } from "@/lib/db/schema";

export const DEFAULT_LEAD_NOTIFICATION_EMAIL = "info@aponchukworkflow.com";
export const TELEGRAM_RECIPIENT_INVITE_EMAIL = "__telegram_recipient__";
export const MAX_TELEGRAM_RECIPIENTS = 10;

function parseEnvEmails(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function ensureNotificationSettings() {
  const db = getDb();
  const [row] = await db
    .select()
    .from(notificationSettings)
    .where(eq(notificationSettings.id, "default"))
    .limit(1);

  if (row) return row;

  const [created] = await db
    .insert(notificationSettings)
    .values({ id: "default", leadEmails: [], telegramRecipients: [], updatedAt: new Date() })
    .returning();
  return created;
}

export async function getLeadNotificationEmails() {
  const db = getDb();
  const [row] = await db
    .select({ leadEmails: notificationSettings.leadEmails })
    .from(notificationSettings)
    .where(eq(notificationSettings.id, "default"))
    .limit(1);

  if (row?.leadEmails?.length) return row.leadEmails;
  const envEmails = parseEnvEmails(process.env.LEAD_NOTIFICATION_EMAIL);
  if (envEmails.length) return envEmails;
  return [DEFAULT_LEAD_NOTIFICATION_EMAIL];
}

export async function getExtraTelegramRecipients(): Promise<TelegramRecipient[]> {
  const row = await ensureNotificationSettings();
  return row.telegramRecipients ?? [];
}

export async function upsertExtraTelegramRecipient(recipient: TelegramRecipient) {
  const db = getDb();
  await ensureNotificationSettings();
  const current = await getExtraTelegramRecipients();
  const next = [
    ...current.filter((item) => item.telegramUserId !== recipient.telegramUserId),
    recipient,
  ];
  if (next.length > MAX_TELEGRAM_RECIPIENTS) {
    throw new Error(`You can add up to ${MAX_TELEGRAM_RECIPIENTS} extra Telegram accounts.`);
  }
  await db
    .update(notificationSettings)
    .set({ telegramRecipients: next, updatedAt: new Date() })
    .where(eq(notificationSettings.id, "default"));
  return next;
}

export async function removeExtraTelegramRecipient(telegramUserId: string) {
  const db = getDb();
  await ensureNotificationSettings();
  const current = await getExtraTelegramRecipients();
  const next = current.filter((item) => item.telegramUserId !== telegramUserId);
  await db
    .update(notificationSettings)
    .set({ telegramRecipients: next, updatedAt: new Date() })
    .where(eq(notificationSettings.id, "default"));
  return next;
}
