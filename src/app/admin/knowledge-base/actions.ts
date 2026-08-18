"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { knowledgeBaseEntries } from "@/lib/db/schema";
import { invalidateAssistantConfig } from "@/lib/chat/config-cache";
import { newId } from "@/lib/id";

function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createKbEntry(formData: FormData) {
  await requireAdmin();
  const intent = String(formData.get("intent") || "").trim();
  const approvedAnswer = String(formData.get("approvedAnswer") || "").trim();
  const slug = sanitizeSlug(String(formData.get("slug") || ""));
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

export async function updateKbEntryById(input: {
  id: string;
  slug: string;
  intent: string;
  approvedAnswer: string;
  active: boolean;
}) {
  await requireAdmin();
  const id = input.id.trim();
  const intent = input.intent.trim();
  const approvedAnswer = input.approvedAnswer.trim();
  const slug = sanitizeSlug(input.slug);
  if (!id || !intent || !approvedAnswer || !slug) {
    return { ok: false as const, error: "missing" };
  }

  const db = getDb();
  const [existing] = await db
    .select({ id: knowledgeBaseEntries.id })
    .from(knowledgeBaseEntries)
    .where(eq(knowledgeBaseEntries.slug, slug))
    .limit(1);
  if (existing && existing.id !== id) {
    return { ok: false as const, error: "slug" };
  }

  await db
    .update(knowledgeBaseEntries)
    .set({
      slug,
      intent,
      approvedAnswer,
      active: input.active,
      updatedAt: new Date(),
    })
    .where(eq(knowledgeBaseEntries.id, id));
  invalidateAssistantConfig();
  revalidatePath("/admin/knowledge-base");
  return { ok: true as const };
}

export async function deleteKbEntryById(id: string) {
  await requireAdmin();
  if (!id) return { ok: false as const, error: "missing" };
  const db = getDb();
  const [entry] = await db
    .select({ id: knowledgeBaseEntries.id })
    .from(knowledgeBaseEntries)
    .where(eq(knowledgeBaseEntries.id, id))
    .limit(1);
  if (!entry) return { ok: false as const, error: "missing" };
  await db.delete(knowledgeBaseEntries).where(eq(knowledgeBaseEntries.id, id));
  invalidateAssistantConfig();
  revalidatePath("/admin/knowledge-base");
  return { ok: true as const };
}
