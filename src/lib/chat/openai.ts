import OpenAI from "openai";
import { getAssistantConfig } from "@/lib/chat/config-cache";
import { formatAnswerLabels, ruleBasedDiagnostic } from "@/lib/chat/diagnostic";
import type { AssessmentAnswers } from "@/lib/db/schema";

function client() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function kbBlock(entries: Array<{ intent: string; approvedAnswer: string }>) {
  return entries.map((entry, index) => `${index + 1}. Q: ${entry.intent}\nA: ${entry.approvedAnswer}`).join("\n\n");
}

export async function answerFaq(userMessage: string, history: Array<{ role: "user" | "assistant"; content: string }>) {
  const config = await getAssistantConfig();
  const openai = client();
  if (!openai) return config.fallbackUnknown;

  const kb = kbBlock(config.knowledgeBase);
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `${config.systemPrompt}

Unknown fallback: ${config.fallbackUnknown}
Medical fallback: ${config.fallbackMedical}
PHI fallback: ${config.fallbackPhi}
Guarantee fallback: ${config.fallbackGuarantee}

${config.faqPrompt}

APPROVED KNOWLEDGE BASE:
${kb || "(empty — use the unknown fallback)"}`,
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
    return completion.choices[0]?.message?.content?.trim() || config.fallbackUnknown;
  } catch (error) {
    console.error("[openai] FAQ failed:", error);
    return config.fallbackUnknown;
  }
}

export async function generateDiagnostic(answers: AssessmentAnswers) {
  const fallback = ruleBasedDiagnostic(answers);
  const config = await getAssistantConfig();
  const openai = client();
  if (!openai) return fallback;

  try {
    const completion = await openai.chat.completions.create({
      model: config.openaiModel,
      temperature: Math.min(config.temperature, 0.4),
      max_tokens: 320,
      messages: [
        { role: "system", content: `${config.systemPrompt}\n\n${config.diagnosticPrompt}` },
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
