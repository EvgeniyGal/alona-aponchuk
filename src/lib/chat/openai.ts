import OpenAI from "openai";
import { getAssistantConfig } from "@/lib/chat/config-cache";
import { formatAnswerLabels, ruleBasedDiagnostic } from "@/lib/chat/diagnostic";
import type { AssessmentAnswers } from "@/lib/db/schema";
import { getChatCatalog, languageInstruction } from "@/i18n/catalog";
import type { AppLocale } from "@/i18n/config";
import { defaultLocale, parseAppLocale } from "@/i18n/config";

function client() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function kbBlock(entries: Array<{ intent: string; approvedAnswer: string }>) {
  return entries.map((entry, index) => `${index + 1}. Q: ${entry.intent}\nA: ${entry.approvedAnswer}`).join("\n\n");
}

export async function answerFaq(
  userMessage: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  locale: AppLocale = defaultLocale,
  retrievedContext = "",
) {
  const config = await getAssistantConfig();
  const chat = getChatCatalog(locale);
  const openai = client();
  if (!openai) return chat.fallbackUnknown || config.fallbackUnknown;

  const kb = kbBlock(config.knowledgeBase);
  const retrieval = retrievedContext
    ? `\n\nRETRIEVED DOCUMENT CONTEXT:\n${retrievedContext}\n\nIf the approved knowledge base and retrieved documents conflict, prefer the approved knowledge base. You may use retrieved documents for additional grounded detail. If neither covers the question, use the unknown fallback.`
    : "";

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `${config.systemPrompt}

${languageInstruction(locale)}

Unknown fallback: ${chat.fallbackUnknown || config.fallbackUnknown}
Medical fallback: ${chat.fallbackMedical || config.fallbackMedical}
PHI fallback: ${chat.fallbackPhi || config.fallbackPhi}
Guarantee fallback: ${chat.fallbackGuarantee || config.fallbackGuarantee}

${config.faqPrompt}

APPROVED KNOWLEDGE BASE:
${kb || "(empty — use the unknown fallback)"}${retrieval}`,
    },
    ...history.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    })),
    { role: "user", content: userMessage },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: config.openaiModel,
      temperature: config.temperature,
      max_tokens: 500,
      messages,
    });
    return completion.choices[0]?.message?.content?.trim() || chat.fallbackUnknown || config.fallbackUnknown;
  } catch (error) {
    console.error("[openai] FAQ failed:", error);
    return chat.fallbackUnknown || config.fallbackUnknown;
  }
}

export async function generateDiagnostic(answers: AssessmentAnswers, locale: AppLocale = defaultLocale) {
  const resolved = parseAppLocale(locale);
  const fallback = ruleBasedDiagnostic(answers, resolved);
  const config = await getAssistantConfig();
  const openai = client();
  if (!openai) return fallback;

  try {
    const completion = await openai.chat.completions.create({
      model: config.openaiModel,
      temperature: Math.min(config.temperature, 0.4),
      max_tokens: 320,
      messages: [
        {
          role: "system",
          content: `${config.systemPrompt}\n\n${languageInstruction(resolved)}\n\n${config.diagnosticPrompt}`,
        },
        {
          role: "user",
          content: `Assessment answers:\n${formatAnswerLabels(answers)}`,
        },
      ],
    });
    return completion.choices[0]?.message?.content?.trim() || fallback;
  } catch (error) {
    console.error("[openai] diagnostic failed:", error);
    return fallback;
  }
}
