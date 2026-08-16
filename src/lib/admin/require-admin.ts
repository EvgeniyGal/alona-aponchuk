import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user?.approved) redirect("/admin/login");
  return user;
}
