"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { chatSessions, leads } from "@/lib/db/schema";
import { isLeadStatus, type LeadStatus } from "@/lib/admin/lead-status";

export async function updateLeadStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!isLeadStatus(status)) return;
  const db = getDb();
  await db
    .update(leads)
    .set({ status, updatedAt: new Date() })
    .where(eq(leads.id, id));
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
}

export async function updateLeadStatusById(id: string, status: LeadStatus) {
  await requireAdmin();
  if (!isLeadStatus(status)) return { ok: false as const };
  const db = getDb();
  await db
    .update(leads)
    .set({ status, updatedAt: new Date() })
    .where(eq(leads.id, id));
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
  return { ok: true as const };
}

export async function deleteLeadById(id: string) {
  await requireAdmin();
  if (!id) return { ok: false as const, error: "Lead not found." };

  const db = getDb();
  const [lead] = await db.select({ id: leads.id }).from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) return { ok: false as const, error: "Lead not found." };

  await db.update(chatSessions).set({ leadId: null, updatedAt: new Date() }).where(eq(chatSessions.leadId, id));
  await db.delete(leads).where(eq(leads.id, id));

  revalidatePath("/admin/leads");
  revalidatePath("/admin/sessions");
  return { ok: true as const };
}
