"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { knowledgeBaseEntries } from "@/lib/db/schema";
import { invalidateAssistantConfig } from "@/lib/chat/config-cache";
import { newId } from "@/lib/id";

export async function createKbEntry(formData: FormData) {
  await requireAdmin();
  const intent = String(formData.get("intent") || "").trim();
  const approvedAnswer = String(formData.get("approvedAnswer") || "").trim();
  const slug = String(formData.get("slug") || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
  if (!intent || !approvedAnswer || !slug) return;
  const db = getDb();
  await db.insert(knowledgeBaseEntries).values({
    id: newId(),
    slug,
    intent,
    approvedAnswer,
    active: true,
    sortOrder: 999,
  });
  invalidateAssistantConfig();
  revalidatePath("/admin/knowledge-base");
}

export async function updateKbEntry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const db = getDb();
  await db
    .update(knowledgeBaseEntries)
    .set({
      intent: String(formData.get("intent") || ""),
      approvedAnswer: String(formData.get("approvedAnswer") || ""),
      active: formData.get("active") === "on",
      updatedAt: new Date(),
    })
    .where(eq(knowledgeBaseEntries.id, id));
  invalidateAssistantConfig();
  revalidatePath("/admin/knowledge-base");
}

export async function deleteKbEntry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const db = getDb();
  await db.delete(knowledgeBaseEntries).where(eq(knowledgeBaseEntries.id, id));
  invalidateAssistantConfig();
  revalidatePath("/admin/knowledge-base");
}
