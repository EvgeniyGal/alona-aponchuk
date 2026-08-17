import OpenAI from "openai";
import { getAssistantConfig } from "@/lib/chat/config-cache";
import { classifyRisk } from "@/lib/chat/safety";
import { getChatCatalog, languageInstruction } from "@/i18n/catalog";
import type { AppLocale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { formatRetrievedContext, retrieveChunks, type RetrievedChunk } from "@/lib/rag/retrieve";

export async function answerFromDocuments({
  question,
  documentIds,
  locale = defaultLocale,
  applySafety = true,
}: {
  question: string;
  documentIds?: string[] | "all";
  locale?: AppLocale;
  applySafety?: boolean;
}): Promise<{ answer: string; chunks: RetrievedChunk[] }> {
  const chat = getChatCatalog(locale);
  if (applySafety) {
    const risk = classifyRisk(question);
    if (risk === "phi") return { answer: chat.fallbackPhi, chunks: [] };
    if (risk === "medical") return { answer: chat.fallbackMedical, chunks: [] };
    if (risk === "guarantee") return { answer: chat.fallbackGuarantee, chunks: [] };
  }

  const chunks = await retrieveChunks({ query: question, documentIds, limit: 8 });
  if (chunks.length === 0) {
    return { answer: chat.fallbackUnknown, chunks: [] };
  }

  const config = await getAssistantConfig();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { answer: chat.fallbackUnknown, chunks };
  }

  const openai = new OpenAI({ apiKey });
  const context = formatRetrievedContext(chunks);
  const completion = await openai.chat.completions.create({
    model: config.openaiModel,
    temperature: Math.min(config.temperature, 0.3),
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: `${languageInstruction(locale)}

Answer only from the retrieved document excerpts. If the excerpts do not contain the answer, say you do not have enough information. Do not invent facts.

${chat.fallbackUnknown ? `Unknown fallback: ${chat.fallbackUnknown}` : ""}

RETRIEVED DOCUMENT CONTEXT:
${context}`,
      },
      { role: "user", content: question },
    ],
  });

  return {
    answer: completion.choices[0]?.message?.content?.trim() || chat.fallbackUnknown,
    chunks,
  };
}
