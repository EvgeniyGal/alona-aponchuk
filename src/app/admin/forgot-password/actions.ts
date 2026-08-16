"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { authTokens, users } from "@/lib/db/schema";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { newId } from "@/lib/id";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { siteUrl } from "@/lib/site-url";

export async function requestPasswordReset(_prev: string | undefined, formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  if (!email) return "Enter your email.";

  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (user?.approved) {
    const token = generateToken();
    await db.insert(authTokens).values({
      id: newId(),
      userId: user.id,
      email,
      purpose: "password_reset",
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
    await sendTemplateEmail("password-reset", email, {
      templateData: { resetUrl: `${siteUrl()}/admin/reset-password?token=${token}` },
    });
  }
  return "If that email is registered, a reset link is on its way.";
}
