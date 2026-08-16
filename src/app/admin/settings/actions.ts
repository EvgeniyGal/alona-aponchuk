"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { assistantSettings } from "@/lib/db/schema";
import { invalidateAssistantConfig } from "@/lib/chat/config-cache";

export async function saveAssistantSettings(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  await db
    .update(assistantSettings)
    .set({
      openaiModel: String(formData.get("openaiModel") || "gpt-4o-mini"),
      temperature: Number(formData.get("temperature") || 0.3),
      systemPrompt: String(formData.get("systemPrompt") || ""),
      faqPrompt: String(formData.get("faqPrompt") || ""),
      diagnosticPrompt: String(formData.get("diagnosticPrompt") || ""),
      fallbackUnknown: String(formData.get("fallbackUnknown") || ""),
      fallbackMedical: String(formData.get("fallbackMedical") || ""),
      fallbackPhi: String(formData.get("fallbackPhi") || ""),
      fallbackGuarantee: String(formData.get("fallbackGuarantee") || ""),
      updatedAt: new Date(),
    })
    .where(eq(assistantSettings.id, "default"));
  invalidateAssistantConfig();
  revalidatePath("/admin/settings");
}
