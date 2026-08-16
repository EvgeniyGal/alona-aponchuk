export type ChatOption = {
  label: string;
  compactLabel?: string;
  value: string;
  other?: boolean;
  custom?: boolean;
};

export type QuestionStep = {
  id: string;
  field: string;
  prompt: string;
  multi?: boolean;
  maxSelect?: number;
  options?: ChatOption[];
  freeText?: boolean;
  otherPrompt?: string;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  suggestions?: string[];
};

export const CRM_SUGGESTIONS = [
  "HubSpot",
  "Salesforce",
  "Jane App",
  "SimplePractice",
  "Zenoti",
  "Vagaro",
  "Mindbody",
  "Practice Better",
  "IntakeQ",
  "Kareo",
  "Athenahealth",
  "DrChrono",
];

export const QUESTIONS: Record<string, QuestionStep> = {
  q1: {
    id: "q1",
    field: "organization_type",
    prompt: "What type of organization do you represent?",
    options: [
      { label: "Medical Practice", value: "medical_practice" },
      { label: "Wellness Center", value: "wellness_center" },
      { label: "MedSpa / Aesthetics", value: "medspa_aesthetics" },
      { label: "Integrative Health", value: "integrative_health" },
      { label: "Therapy / Mental Health", value: "therapy_mental_health" },
      { label: "Rehabilitation", value: "rehabilitation" },
      { label: "Other", value: "other", other: true },
    ],
    otherPrompt: "Please describe your organization.",
  },
  q2: {
    id: "q2",
    field: "role",
    prompt: "What is your role in the organization?",
    options: [
      { label: "Owner / Founder", value: "owner_founder" },
      { label: "Practice Manager", value: "practice_manager" },
      { label: "Operations Manager", value: "operations_manager" },
      { label: "Administrator", value: "administrator" },
      { label: "Other", value: "other", other: true },
    ],
    otherPrompt: "Please describe your role.",
  },
  q3: {
    id: "q3",
    field: "main_problem",
    prompt: "What is the biggest workflow problem right now?",
    multi: true,
    maxSelect: 3,
    options: [
      { label: "Slow Lead Response", value: "slow_lead_response" },
      { label: "Form Drop-Off", value: "form_dropoff" },
      { label: "Scheduling Issues", value: "scheduling_issues" },
      { label: "Too Many No-Shows", value: "too_many_noshows" },
      { label: "Too Many Repetitive Questions", value: "repetitive_questions" },
      { label: "Weak Follow-Up", value: "weak_followup" },
      { label: "CRM Is Disorganized", value: "crm_disorganized" },
      { label: "Systems Are Disconnected", value: "systems_disconnected" },
      { label: "Chatbot Works Poorly", value: "chatbot_poor" },
      { label: "Not Sure Where to Start with AI", value: "ai_unsure" },
      { label: "Other", value: "other", other: true },
    ],
    otherPrompt: "Please describe the main workflow problem.",
  },
  q4: {
    id: "q4",
    field: "client_dropoff_stage",
    prompt: "Where do clients most often get lost or stop moving forward?",
    options: [
      { label: "After First Inquiry", value: "after_first_inquiry" },
      { label: "After Form Submission", value: "after_form" },
      { label: "Before Booking", value: "before_booking" },
      { label: "Before the Visit", value: "before_visit" },
      { label: "After the First Visit", value: "after_first_visit" },
      { label: "During Follow-Up", value: "during_followup" },
      { label: "Before Repeat Visit", value: "before_repeat_visit" },
      { label: "Not Sure", value: "not_sure" },
    ],
  },
  q5: {
    id: "q5",
    field: "crm_status",
    prompt: "Do you currently use a CRM, EHR, or patient management system?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "Not Sure", value: "not_sure" },
    ],
  },
  q5_crm: {
    id: "q5_crm",
    field: "crm_platform",
    prompt: "Which system do you use?",
    freeText: true,
    placeholder: "Platform name",
    suggestions: CRM_SUGGESTIONS,
  },
  q5_tracking: {
    id: "q5_tracking",
    field: "tracking_method",
    prompt: "How do you track inquiries and follow-up?",
    options: [
      { label: "Spreadsheet", value: "spreadsheet" },
      { label: "Email", value: "email" },
      { label: "Phone Notes", value: "phone_notes" },
      { label: "Scheduling Tool", value: "scheduling_tool" },
      { label: "Messaging Apps", value: "messaging_apps" },
      { label: "Several Tools", value: "several_tools" },
      { label: "No Structured System", value: "no_structured_system" },
      { label: "Other", value: "other", other: true },
    ],
    otherPrompt: "Please describe how you track inquiries and follow-up.",
  },
  q6: {
    id: "q6",
    field: "followup_method",
    prompt: "How is follow-up handled today?",
    options: [
      { label: "Mostly Manual", value: "manual" },
      { label: "Partly Automated", value: "partly_automated" },
      { label: "Mostly Automated", value: "mostly_automated" },
      { label: "Different for Each Staff Member", value: "inconsistent" },
      { label: "No Set Process", value: "no_process" },
      { label: "Not Sure", value: "not_sure" },
    ],
  },
  q6_who: {
    id: "q6_who",
    field: "followup_owner",
    prompt: "Who usually handles it?",
    options: [
      { label: "Front Desk", value: "front_desk" },
      { label: "Practice Manager", value: "practice_manager" },
      { label: "Owner", value: "owner" },
      { label: "Provider", value: "provider" },
      { label: "Several People", value: "several_people" },
      { label: "Other", value: "other", other: true },
    ],
    otherPrompt: "Please describe who handles follow-up.",
  },
  q7: {
    id: "q7",
    field: "ai_automation_status",
    prompt: "Do you currently use a chatbot, automated replies, or AI-supported communication?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "In Progress", value: "in_progress" },
      { label: "Not Sure", value: "not_sure" },
    ],
  },
  q7a: {
    id: "q7a",
    field: "chatbot_issues",
    prompt: "What is the main problem with your current chatbot or automation?",
    multi: true,
    maxSelect: 3,
    options: [
      { label: "Answers Are Too Generic", compactLabel: "Too Generic", value: "generic_answers" },
      { label: "Sometimes Gives Wrong Answers", compactLabel: "Wrong Answers", value: "wrong_answers" },
      { label: "Doesn’t Use Our Business Info", compactLabel: "No Business Context", value: "no_business_context" },
      { label: "No Staff Handoff", compactLabel: "No Staff Handoff", value: "no_staff_handoff" },
      { label: "Not Connected to CRM", compactLabel: "No CRM Link", value: "no_crm_integration" },
      { label: "Hard to Update", compactLabel: "Hard to Update", value: "hard_to_update" },
      { label: "Clients Don’t Use It", compactLabel: "Low Engagement", value: "low_engagement" },
      { label: "Not Tested Enough", compactLabel: "Not Tested", value: "not_tested" },
      { label: "Other / Enter My Own", compactLabel: "Other", value: "other", other: true },
    ],
    otherPrompt: "Please describe the main problem with your current chatbot or automation.",
  },
  q8: {
    id: "q8",
    field: "monthly_inquiries",
    prompt: "About how many new inquiries do you receive per month?",
    options: [
      { label: "1–25", value: "1_25" },
      { label: "26–100", value: "26_100" },
      { label: "100+", value: "100_plus" },
      { label: "Enter My Own", value: "custom", custom: true },
    ],
    otherPrompt: "About how many new inquiries do you receive per month? You can also type “Not sure”.",
    placeholder: "e.g. 40 or Not sure",
    inputMode: "text",
  },
  q9: {
    id: "q9",
    field: "primary_priority",
    prompt: "What would you most like to improve first?",
    options: [
      { label: "Faster Response & Follow-Up", value: "response_followup" },
      { label: "Less Manual Staff Work", value: "reduce_manual_work" },
      { label: "Better CRM & Automation", value: "crm_automation" },
      { label: "Enter My Own", value: "custom", custom: true },
    ],
    otherPrompt: "What would you most like to improve first?",
  },
};

export const FIRST_STEP = "q1";

const MANUAL_FOLLOWUP = new Set(["manual", "inconsistent", "no_process"]);
const HAS_CHATBOT = new Set(["yes", "in_progress"]);

export function nextStep(currentId: string, answers: Record<string, { value: string | string[] }>): string | "complete" {
  switch (currentId) {
    case "q1":
      return "q2";
    case "q2":
      return "q3";
    case "q3":
      return "q4";
    case "q4":
      return "q5";
    case "q5": {
      const status = String(answers.crm_status?.value ?? "");
      if (status === "yes") return "q5_crm";
      if (status === "no") return "q5_tracking";
      return "q6";
    }
    case "q5_crm":
    case "q5_tracking":
      return "q6";
    case "q6": {
      const method = String(answers.followup_method?.value ?? "");
      if (MANUAL_FOLLOWUP.has(method)) return "q6_who";
      return "q7";
    }
    case "q6_who":
      return "q7";
    case "q7": {
      const status = String(answers.ai_automation_status?.value ?? "");
      if (HAS_CHATBOT.has(status)) return "q7a";
      return "q8";
    }
    case "q7a":
      return "q8";
    case "q8":
      return "q9";
    case "q9":
      return "complete";
    default:
      return "complete";
  }
}

export function optionByValue(step: QuestionStep, value: string) {
  return step.options?.find((option) => option.value === value);
}

export const WELCOME_MESSAGE = `Hi! I’m the Aponchuk Workflow Assistant.

I can help you identify where clients may be getting lost between inquiry, scheduling, follow-up, and repeat visits.`;

export const SERVICES_OVERVIEW = `We help healthcare and wellness organizations make the client journey more reliable from the first inquiry to the repeat visit.

Core services include:
• Workflow Audit — a structured review of intake, CRM/EHR logic, scheduling, follow-up, staff handoffs, and existing automation
• CRM & Client Journey Optimization — improve the system you already use
• Automation Readiness — prepare knowledge, rules, and QA before expanding AI
• Chatbot / RAG Design & QA Validation — grounded assistants with tested boundaries
• Pilot Implementation Support — a controlled test before broader rollout
• Optimization Retainer — ongoing calibration and knowledge maintenance

AI is optional. Many engagements start with workflow mapping and CRM cleanup. The usual first step is a Workflow Audit.`;
