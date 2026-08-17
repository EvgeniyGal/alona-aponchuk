import type { AssessmentAnswer, AssessmentAnswers, ChatMessageUi } from "@/lib/db/schema";
import { FIRST_STEP, nextStep, type QuestionStep } from "@/lib/chat/questionnaire";
import { localizedQuestions } from "@/lib/chat/localize";
import { getAssistantConfig } from "@/lib/chat/config-cache";
import { answerFaq, generateDiagnostic } from "@/lib/chat/openai";
import { classifyRisk } from "@/lib/chat/safety";
import { getChatCatalog } from "@/i18n/catalog";
import type { AppLocale } from "@/i18n/config";
import { defaultLocale, parseAppLocale } from "@/i18n/config";
import { formatRetrievedContext, retrieveChunks } from "@/lib/rag/retrieve";

export type ChatMode =
  | "welcome"
  | "assessment"
  | "faq"
  | "services"
  | "diagnostic"
  | "lead_capture"
  | "done";

export type IncomingMessage =
  | {
      type: "cta";
      value:
        | "start_assessment"
        | "continue_assessment"
        | "pause_assessment"
        | "ask_question"
        | "learn_services"
        | "pass_to_alona"
        | "restart";
    }
  | { type: "select"; step: string; value: string }
  | { type: "multi_done"; step: string; values: string[] }
  | { type: "text"; value: string };

export type EngineSession = {
  mode: ChatMode;
  assessmentStep: string | null;
  assessmentAnswers: AssessmentAnswers;
  pendingOtherField: string | null;
  locale: AppLocale;
};

export type EngineMessage = {
  role: "assistant" | "user";
  content: string;
  ui?: ChatMessageUi | null;
};

function hasSavedAssessment(session: EngineSession) {
  return Boolean(session.assessmentStep);
}

function assessmentCta(locale: AppLocale, session: EngineSession) {
  const chat = getChatCatalog(locale);
  if (hasSavedAssessment(session)) {
    return { label: chat.continueAssessment, value: "continue_assessment" as const };
  }
  return { label: chat.startAssessment, value: "start_assessment" as const };
}

function followupCtas(locale: AppLocale, session: EngineSession): ChatMessageUi {
  const chat = getChatCatalog(locale);
  return {
    kind: "followup_ctas",
    options: [
      assessmentCta(locale, session),
      { label: chat.passToAlona, value: "pass_to_alona" },
    ],
  };
}

function pausedUi(locale: AppLocale): ChatMessageUi {
  const chat = getChatCatalog(locale);
  return {
    kind: "followup_ctas",
    options: [
      { label: chat.continueAssessment, value: "continue_assessment" },
      { label: chat.askQuestion, value: "ask_question" },
      { label: chat.passToAlona, value: "pass_to_alona" },
    ],
  };
}

function welcomeUi(locale: AppLocale): ChatMessageUi {
  const chat = getChatCatalog(locale);
  return {
    kind: "welcome_ctas",
    options: [
      { label: chat.startAssessment, value: "start_assessment" },
      { label: chat.askQuestion, value: "ask_question" },
      { label: chat.learnServices, value: "learn_services" },
    ],
  };
}

const LEAD_FORM_UI: ChatMessageUi = { kind: "lead_form" };

export function welcomeMessages(locale: AppLocale = defaultLocale): EngineMessage[] {
  const chat = getChatCatalog(locale);
  return [{ role: "assistant", content: chat.welcome, ui: welcomeUi(locale) }];
}

function questionUi(step: QuestionStep): ChatMessageUi {
  if (step.freeText) {
    return {
      kind: "text_input",
      step: step.id,
      placeholder: step.placeholder,
      inputMode: step.inputMode ?? "text",
      options: (step.suggestions ?? []).map((label) => ({ label, value: label })),
    };
  }
  if (step.multi) {
    return {
      kind: "multi_buttons",
      step: step.id,
      options: step.options,
    };
  }
  return {
    kind: "buttons",
    step: step.id,
    options: step.options,
  };
}

function questionMessage(locale: AppLocale, stepId: string): EngineMessage {
  const step = localizedQuestions(locale)[stepId];
  return { role: "assistant", content: step.prompt, ui: questionUi(step) };
}

function otherMessage(locale: AppLocale, step: QuestionStep): EngineMessage {
  const chat = getChatCatalog(locale);
  return {
    role: "assistant",
    content: step.otherPrompt || chat.otherPrompt,
    ui: {
      kind: "text_input",
      step: step.id,
      placeholder: step.placeholder,
      inputMode: step.inputMode,
    },
  };
}

function storeAnswer(
  session: EngineSession,
  field: string,
  answer: AssessmentAnswer,
): EngineSession {
  return {
    ...session,
    assessmentAnswers: { ...session.assessmentAnswers, [field]: answer },
    pendingOtherField: null,
  };
}

async function afterAnswer(session: EngineSession, currentId: string, messages: EngineMessage[]) {
  const nxt = nextStep(currentId, session.assessmentAnswers);
  const chat = getChatCatalog(session.locale);
  if (nxt === "complete") {
    const diagnostic = await generateDiagnostic(session.assessmentAnswers, session.locale);
    messages.push({ role: "assistant", content: diagnostic });
    messages.push({
      role: "assistant",
      content: chat.leadPrompt,
      ui: LEAD_FORM_UI,
    });
    return {
      session: {
        ...session,
        mode: "lead_capture" as const,
        assessmentStep: null,
        pendingOtherField: null,
      },
      messages,
    };
  }
  messages.push(questionMessage(session.locale, nxt));
  return {
    session: { ...session, mode: "assessment" as const, assessmentStep: nxt, pendingOtherField: null },
    messages,
  };
}

export async function processTurn(
  session: EngineSession,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  input: IncomingMessage,
): Promise<{ session: EngineSession; messages: EngineMessage[] }> {
  const locale = parseAppLocale(session.locale);
  session = { ...session, locale };
  const chat = getChatCatalog(locale);
  const questions = localizedQuestions(locale);

  if (input.type === "cta") {
    if (input.value === "restart") {
      return {
        session: {
          mode: "welcome",
          assessmentStep: null,
          assessmentAnswers: {},
          pendingOtherField: null,
          locale,
        },
        messages: welcomeMessages(locale),
      };
    }
    if (input.value === "start_assessment") {
      return {
        session: {
          ...session,
          mode: "assessment",
          assessmentStep: FIRST_STEP,
          assessmentAnswers: {},
          pendingOtherField: null,
        },
        messages: [
          { role: "user", content: chat.startAssessment },
          questionMessage(locale, FIRST_STEP),
        ],
      };
    }
    if (input.value === "pause_assessment") {
      if (session.mode !== "assessment" || !session.assessmentStep) {
        return { session, messages: [] };
      }
      return {
        session: { ...session, mode: "faq" },
        messages: [
          { role: "user", content: chat.pauseAssessment },
          { role: "assistant", content: chat.pauseSaved, ui: pausedUi(locale) },
        ],
      };
    }
    if (input.value === "continue_assessment") {
      const stepId =
        session.assessmentStep && questions[session.assessmentStep] ? session.assessmentStep : FIRST_STEP;
      const pendingStep =
        session.pendingOtherField && questions[session.pendingOtherField]
          ? questions[session.pendingOtherField]
          : null;
      return {
        session: { ...session, mode: "assessment", assessmentStep: stepId },
        messages: [
          { role: "user", content: chat.continueAssessment },
          pendingStep ? otherMessage(locale, pendingStep) : questionMessage(locale, stepId),
        ],
      };
    }
    if (input.value === "ask_question") {
      return {
        session: { ...session, mode: "faq" },
        messages: [
          { role: "user", content: chat.askQuestion },
          { role: "assistant", content: chat.faqIntro },
        ],
      };
    }
    if (input.value === "learn_services") {
      return {
        session: { ...session, mode: "services" },
        messages: [
          { role: "user", content: chat.learnServices },
          { role: "assistant", content: chat.servicesOverview, ui: followupCtas(locale, session) },
        ],
      };
    }
    if (input.value === "pass_to_alona") {
      return {
        session: { ...session, mode: "lead_capture" },
        messages: [
          { role: "user", content: chat.passToAlona },
          {
            role: "assistant",
            content: chat.passPrompt,
            ui: LEAD_FORM_UI,
          },
        ],
      };
    }
  }

  if (session.pendingOtherField && input.type === "text") {
    const step = questions[session.pendingOtherField];
    const existing = session.assessmentAnswers[step.field];
    const extra = input.value.trim();
    const updated = storeAnswer(session, step.field, {
      value: existing?.value ?? "other",
      label: existing?.label ?? "Other",
      extra,
    });
    return afterAnswer(updated, step.id, [{ role: "user", content: extra }]);
  }

  if (input.type === "select" && session.mode === "assessment") {
    const step = questions[input.step];
    if (!step || step.id !== session.assessmentStep) {
      return { session, messages: [] };
    }
    const option = step.options?.find((item) => item.value === input.value);
    if (!option && !step.freeText) {
      return { session, messages: [] };
    }
    if (option?.other || option?.custom) {
      const nextSession = storeAnswer(session, step.field, {
        value: option.value,
        label: option.label,
      });
      return {
        session: { ...nextSession, pendingOtherField: step.id },
        messages: [{ role: "user", content: option.label }, otherMessage(locale, step)],
      };
    }
    const label = option?.label ?? input.value;
    const updated = storeAnswer(session, step.field, { value: input.value, label });
    return afterAnswer(updated, step.id, [{ role: "user", content: label }]);
  }

  if (input.type === "multi_done" && session.mode === "assessment") {
    const step = questions[input.step];
    if (!step?.multi || step.id !== session.assessmentStep) {
      return { session, messages: [] };
    }
    const values = input.values.slice(0, step.maxSelect ?? 3);
    const options = values
      .map((value) => step.options?.find((item) => item.value === value))
      .filter((option): option is NonNullable<typeof option> => Boolean(option));
    const labels = options.map((option) => option.compactLabel || option.label);
    const updated = storeAnswer(session, step.field, {
      value: options.map((option) => option.value),
      label: labels,
    });
    const includesOther = options.some((option) => option.other);
    if (includesOther) {
      return {
        session: { ...updated, pendingOtherField: step.id },
        messages: [{ role: "user", content: labels.join(", ") }, otherMessage(locale, step)],
      };
    }
    return afterAnswer(updated, step.id, [{ role: "user", content: labels.join(", ") }]);
  }

  if (input.type === "text") {
    const text = input.value.trim();
    if (!text) return { session, messages: [] };

    if (session.mode === "assessment" && session.assessmentStep) {
      const step = questions[session.assessmentStep];
      if (!step) return { session, messages: [] };
      if (step.freeText) {
        const updated = storeAnswer(session, step.field, { value: "custom", label: text });
        return afterAnswer(updated, step.id, [{ role: "user", content: text }]);
      }
      return {
        session,
        messages: [
          { role: "user", content: text },
          { role: "assistant", content: chat.chooseOption, ui: questionUi(step) },
        ],
      };
    }

    if (session.mode === "welcome") {
      session = { ...session, mode: "faq" };
    }

    const userMessage: EngineMessage = { role: "user", content: text };
    const risk = classifyRisk(text);
    if (risk) {
      const config = await getAssistantConfig();
      const fallback =
        risk === "phi"
          ? chat.fallbackPhi || config.fallbackPhi
          : risk === "medical"
            ? chat.fallbackMedical || config.fallbackMedical
            : chat.fallbackGuarantee || config.fallbackGuarantee;
      return {
        session: { ...session, mode: session.mode === "assessment" ? session.mode : "faq" },
        messages: [userMessage, { role: "assistant", content: fallback, ui: followupCtas(locale, session) }],
      };
    }

    let retrieved = "";
    try {
      const chunks = await retrieveChunks({ query: text, documentIds: "all", limit: 6 });
      retrieved = formatRetrievedContext(chunks);
    } catch (error) {
      console.error("[rag] retrieval skipped:", error);
    }
    const reply = await answerFaq(text, [...history, { role: "user", content: text }], locale, retrieved);
    return {
      session: { ...session, mode: "faq" },
      messages: [userMessage, { role: "assistant", content: reply, ui: followupCtas(locale, session) }],
    };
  }

  return { session, messages: [] };
}
