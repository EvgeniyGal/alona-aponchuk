import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, status: 401 as const, error: "Unauthorized" };
  }
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user?.approved) {
    return { ok: false as const, status: 401 as const, error: "Unauthorized" };
  }
  return { ok: true as const, user };
}
