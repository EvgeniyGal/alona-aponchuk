import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { notificationSettings } from "@/lib/db/schema";

export const DEFAULT_LEAD_NOTIFICATION_EMAIL = "info@aponchukworkflow.com";

function parseEnvEmails(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
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
