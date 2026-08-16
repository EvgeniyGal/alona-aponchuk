import { unstable_cache, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { assistantSettings, knowledgeBaseEntries } from "@/lib/db/schema";
import {
  DEFAULT_DIAGNOSTIC_PROMPT,
  DEFAULT_FAQ_PROMPT,
  DEFAULT_SYSTEM_PROMPT,
  FALLBACK_GUARANTEE,
  FALLBACK_MEDICAL,
  FALLBACK_PHI,
  FALLBACK_UNKNOWN,
} from "@/lib/chat/defaults";

export const ASSISTANT_CACHE_TAG = "assistant-config";

export type CachedAssistantConfig = {
  openaiModel: string;
  temperature: number;
  systemPrompt: string;
  faqPrompt: string;
  diagnosticPrompt: string;
  fallbackUnknown: string;
  fallbackMedical: string;
  fallbackPhi: string;
  fallbackGuarantee: string;
  knowledgeBase: Array<{ intent: string; approvedAnswer: string }>;
};

const DEFAULT_CONFIG: CachedAssistantConfig = {
  openaiModel: "gpt-4o-mini",
  temperature: 0.3,
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  faqPrompt: DEFAULT_FAQ_PROMPT,
  diagnosticPrompt: DEFAULT_DIAGNOSTIC_PROMPT,
  fallbackUnknown: FALLBACK_UNKNOWN,
  fallbackMedical: FALLBACK_MEDICAL,
  fallbackPhi: FALLBACK_PHI,
  fallbackGuarantee: FALLBACK_GUARANTEE,
  knowledgeBase: [],
};

async function loadAssistantConfig(): Promise<CachedAssistantConfig> {
  const db = getDb();
  const [settings] = await db.select().from(assistantSettings).where(eq(assistantSettings.id, "default")).limit(1);
  const entries = await db
    .select({
      intent: knowledgeBaseEntries.intent,
      approvedAnswer: knowledgeBaseEntries.approvedAnswer,
    })
    .from(knowledgeBaseEntries)
    .where(eq(knowledgeBaseEntries.active, true));

  if (!settings) {
    return { ...DEFAULT_CONFIG, knowledgeBase: entries };
  }

  return {
    openaiModel: settings.openaiModel,
    temperature: settings.temperature,
    systemPrompt: settings.systemPrompt,
    faqPrompt: settings.faqPrompt,
    diagnosticPrompt: settings.diagnosticPrompt,
    fallbackUnknown: settings.fallbackUnknown,
    fallbackMedical: settings.fallbackMedical,
    fallbackPhi: settings.fallbackPhi,
    fallbackGuarantee: settings.fallbackGuarantee,
    knowledgeBase: entries,
  };
}

export const getAssistantConfig = unstable_cache(loadAssistantConfig, ["assistant-config"], {
  tags: [ASSISTANT_CACHE_TAG],
  revalidate: 3600,
});

export function invalidateAssistantConfig() {
  revalidateTag(ASSISTANT_CACHE_TAG);
}
