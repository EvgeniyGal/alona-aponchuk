"use server";

import { and, eq, gt, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { authTokens, users } from "@/lib/db/schema";
import { hashToken } from "@/lib/auth/tokens";
import { hashPassword, isStrongPassword } from "@/lib/auth/password";

export async function acceptInvite(_prev: string | undefined, formData: FormData) {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  if (!isStrongPassword(password)) return "Password must be at least 10 characters.";
  const db = getDb();
  const [record] = await db
    .select()
    .from(authTokens)
    .where(
      and(
        eq(authTokens.purpose, "invite"),
        eq(authTokens.tokenHash, hashToken(token)),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!record?.userId) return "This invite is invalid or expired.";
  await db
    .update(users)
    .set({
      passwordHash: await hashPassword(password),
      emailVerified: new Date(),
      approved: true,
      name: name || undefined,
    })
    .where(eq(users.id, record.userId));
  await db.update(authTokens).set({ usedAt: new Date() }).where(eq(authTokens.id, record.id));
  redirect("/admin/login");
}
