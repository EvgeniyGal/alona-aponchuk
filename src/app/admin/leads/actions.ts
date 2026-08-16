"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";

const statuses = ["new", "contacted", "call_scheduled", "qualified", "closed"] as const;

export async function updateLeadStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!statuses.includes(status as (typeof statuses)[number])) return;
  const db = getDb();
  await db.update(leads).set({ status: status as (typeof statuses)[number], updatedAt: new Date() }).where(eq(leads.id, id));
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
}
