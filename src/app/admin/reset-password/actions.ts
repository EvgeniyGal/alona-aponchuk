"use server";

import { and, eq, gt, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { authTokens, users } from "@/lib/db/schema";
import { hashToken } from "@/lib/auth/tokens";
import { hashPassword, isStrongPassword } from "@/lib/auth/password";

export async function resetPassword(_prev: string | undefined, formData: FormData) {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  if (!isStrongPassword(password)) return "Password must be at least 10 characters.";
  const db = getDb();
  const [record] = await db
    .select()
    .from(authTokens)
    .where(
      and(
        eq(authTokens.purpose, "password_reset"),
        eq(authTokens.tokenHash, hashToken(token)),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!record?.userId) return "This reset link is invalid or expired.";
  await db
    .update(users)
    .set({
      passwordHash: await hashPassword(password),
      emailVerified: new Date(),
    })
    .where(eq(users.id, record.userId));
  await db.update(authTokens).set({ usedAt: new Date() }).where(eq(authTokens.id, record.id));
  redirect("/admin/login");
}
