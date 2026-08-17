import type { AppLocale } from "@/i18n/config";
import { getChatCatalog } from "@/i18n/catalog";
import { QUESTIONS, type QuestionStep } from "@/lib/chat/questionnaire";

export function localizedQuestions(locale: AppLocale): Record<string, QuestionStep> {
  const copy = getChatCatalog(locale).questions as Record<
    string,
    {
      prompt?: string;
      otherPrompt?: string;
      placeholder?: string;
      options?: Record<string, string>;
      compact?: Record<string, string>;
    }
  >;

  const result: Record<string, QuestionStep> = {};
  for (const [id, step] of Object.entries(QUESTIONS)) {
    const local = copy[id];
    result[id] = {
      ...step,
      prompt: local?.prompt ?? step.prompt,
      otherPrompt: local?.otherPrompt ?? step.otherPrompt,
      placeholder: local?.placeholder ?? step.placeholder,
      options: step.options?.map((option) => ({
        ...option,
        label: local?.options?.[option.value] ?? option.label,
        compactLabel: local?.compact?.[option.value] ?? option.compactLabel,
      })),
    };
  }
  return result;
}

export function localizedOptionByValue(locale: AppLocale, stepId: string, value: string) {
  return localizedQuestions(locale)[stepId]?.options?.find((option) => option.value === value);
}
