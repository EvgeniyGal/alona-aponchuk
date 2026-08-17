"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { authTokens, users } from "@/lib/db/schema";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { newId } from "@/lib/id";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { siteUrl } from "@/lib/site-url";

export async function inviteUser(_prev: string | undefined, formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  if (!email) return "Enter an email.";
  const db = getDb();
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  let userId = existing?.id;
  if (!existing) {
    userId = newId();
    await db.insert(users).values({
      id: userId,
      email,
      approved: true,
      role: "admin",
    });
  }
  const token = generateToken();
  await db.insert(authTokens).values({
    id: newId(),
    userId,
    email,
    purpose: "invite",
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  });
  await sendTemplateEmail("admin-invite", email, {
    templateData: { email, inviteUrl: `${siteUrl()}/admin/invite/accept?token=${token}` },
  });
  revalidatePath("/admin/users");
  return `Invite sent to ${email}.`;
}

export async function setUserApproved(userId: string, approved: boolean) {
  const current = await requireAdmin();
  if (!userId) throw new Error("Missing user.");
  if (current.id === userId) {
    throw new Error("You cannot revoke or restore your own admin access.");
  }

  const db = getDb();
  await db.update(users).set({ approved }).where(eq(users.id, userId));
  revalidatePath("/admin/users");
}
