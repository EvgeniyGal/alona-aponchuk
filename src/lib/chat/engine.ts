import type { AssessmentAnswer, AssessmentAnswers, ChatMessageUi } from "@/lib/db/schema";
import {
  FIRST_STEP,
  QUESTIONS,
  SERVICES_OVERVIEW,
  WELCOME_MESSAGE,
  nextStep,
  optionByValue,
  type QuestionStep,
} from "@/lib/chat/questionnaire";
import { getAssistantConfig } from "@/lib/chat/config-cache";
import { answerFaq, generateDiagnostic } from "@/lib/chat/openai";
import { classifyRisk } from "@/lib/chat/safety";

export type ChatMode =
  | "welcome"
  | "assessment"
  | "faq"
  | "services"
  | "diagnostic"
  | "lead_capture"
  | "done";

export type IncomingMessage =
  | { type: "cta"; value: "start_assessment" | "ask_question" | "learn_services" | "pass_to_alona" | "restart" }
  | { type: "select"; step: string; value: string }
  | { type: "multi_done"; step: string; values: string[] }
  | { type: "text"; value: string };

export type EngineSession = {
  mode: ChatMode;
  assessmentStep: string | null;
  assessmentAnswers: AssessmentAnswers;
  pendingOtherField: string | null;
};

export type EngineMessage = {
  role: "assistant" | "user";
  content: string;
  ui?: ChatMessageUi | null;
};

const FOLLOWUP_CTAS: ChatMessageUi = {
  kind: "followup_ctas",
  options: [
    { label: "Start Workflow Assessment", value: "start_assessment" },
    { label: "Pass this to Alona", value: "pass_to_alona" },
  ],
};

const WELCOME_UI: ChatMessageUi = {
  kind: "welcome_ctas",
  options: [
    { label: "Start Workflow Assessment", value: "start_assessment" },
    { label: "Ask a Question", value: "ask_question" },
    { label: "Learn About Services", value: "learn_services" },
  ],
};

const LEAD_FORM_UI: ChatMessageUi = { kind: "lead_form" };

export function welcomeMessages(): EngineMessage[] {
  return [{ role: "assistant", content: WELCOME_MESSAGE, ui: WELCOME_UI }];
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

function questionMessage(stepId: string): EngineMessage {
  const step = QUESTIONS[stepId];
  return { role: "assistant", content: step.prompt, ui: questionUi(step) };
}

function otherMessage(step: QuestionStep): EngineMessage {
  return {
    role: "assistant",
    content: step.otherPrompt || "Please enter a short description.",
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
  if (nxt === "complete") {
    const diagnostic = await generateDiagnostic(session.assessmentAnswers);
    messages.push({ role: "assistant", content: diagnostic });
    messages.push({
      role: "assistant",
      content:
        "If you would like Alona to review this with you, share your contact details and we’ll follow up.",
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
  messages.push(questionMessage(nxt));
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
  if (input.type === "cta") {
    if (input.value === "restart") {
      return {
        session: {
          mode: "welcome",
          assessmentStep: null,
          assessmentAnswers: {},
          pendingOtherField: null,
        },
        messages: welcomeMessages(),
      };
    }
    if (input.value === "start_assessment") {
      const next = {
        session: {
          ...session,
          mode: "assessment" as const,
          assessmentStep: FIRST_STEP,
          pendingOtherField: null,
        },
        messages: [
          { role: "user" as const, content: "Start Workflow Assessment" },
          questionMessage(FIRST_STEP),
        ],
      };
      return next;
    }
    if (input.value === "ask_question") {
      return {
        session: { ...session, mode: "faq" },
        messages: [
          { role: "user", content: "Ask a Question" },
          {
            role: "assistant",
            content:
              "Of course. Ask about services, the Workflow Audit, CRM and client-journey work, or responsible AI. Please don’t share patient-identifying information.",
          },
        ],
      };
    }
    if (input.value === "learn_services") {
      return {
        session: { ...session, mode: "services" },
        messages: [
          { role: "user", content: "Learn About Services" },
          { role: "assistant", content: SERVICES_OVERVIEW, ui: FOLLOWUP_CTAS },
        ],
      };
    }
    if (input.value === "pass_to_alona") {
      return {
        session: { ...session, mode: "lead_capture" },
        messages: [
          { role: "user", content: "Pass this to Alona" },
          {
            role: "assistant",
            content:
              "I can pass this to Alona. Please share your contact details so she can follow up. Avoid patient-identifying information.",
            ui: LEAD_FORM_UI,
          },
        ],
      };
    }
  }

  if (session.pendingOtherField && input.type === "text") {
    const step = QUESTIONS[session.pendingOtherField];
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
    const step = QUESTIONS[input.step];
    if (!step || step.id !== session.assessmentStep) {
      return { session, messages: [] };
    }
    const option = optionByValue(step, input.value);
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
        messages: [{ role: "user", content: option.label }, otherMessage(step)],
      };
    }
    const label = option?.label ?? input.value;
    const updated = storeAnswer(session, step.field, { value: input.value, label });
    return afterAnswer(updated, step.id, [{ role: "user", content: label }]);
  }

  if (input.type === "multi_done" && session.mode === "assessment") {
    const step = QUESTIONS[input.step];
    if (!step?.multi || step.id !== session.assessmentStep) {
      return { session, messages: [] };
    }
    const values = input.values.slice(0, step.maxSelect ?? 3);
    const options = values
      .map((value) => optionByValue(step, value))
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
        messages: [{ role: "user", content: labels.join(", ") }, otherMessage(step)],
      };
    }
    return afterAnswer(updated, step.id, [{ role: "user", content: labels.join(", ") }]);
  }

  if (input.type === "text") {
    const text = input.value.trim();
    if (!text) return { session, messages: [] };

    if (session.mode === "assessment" && session.assessmentStep) {
      const step = QUESTIONS[session.assessmentStep];
      if (step?.freeText) {
        const updated = storeAnswer(session, step.field, { value: "custom", label: text });
        return afterAnswer(updated, step.id, [{ role: "user", content: text }]);
      }
      return {
        session,
        messages: [
          { role: "user", content: text },
          {
            role: "assistant",
            content: "Please choose one of the options above to continue the assessment. You can ask a general question after it wraps up.",
          },
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
          ? config.fallbackPhi
          : risk === "medical"
            ? config.fallbackMedical
            : config.fallbackGuarantee;
      return {
        session: { ...session, mode: session.mode === "assessment" ? session.mode : "faq" },
        messages: [userMessage, { role: "assistant", content: fallback, ui: FOLLOWUP_CTAS }],
      };
    }

    const reply = await answerFaq(text, [...history, { role: "user", content: text }]);
    return {
      session: { ...session, mode: "faq" },
      messages: [userMessage, { role: "assistant", content: reply, ui: FOLLOWUP_CTAS }],
    };
  }

  return { session, messages: [] };
}
