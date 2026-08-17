export const ASSESSMENT_FIELD_LABELS: Record<string, string> = {
  organization_type: "Organization type",
  role: "Role in organization",
  main_problem: "Main workflow problem",
  client_dropoff_stage: "Client drop-off stage",
  crm_status: "CRM / EHR usage",
  crm_platform: "CRM / EHR platform",
  tracking_method: "Inquiry tracking method",
  followup_method: "Follow-up method",
  followup_owner: "Follow-up owner",
  ai_automation_status: "Chatbot / AI status",
  chatbot_issues: "Chatbot / automation issues",
  monthly_inquiries: "Monthly inquiries",
  primary_priority: "Primary priority",
  orgType: "Organization type",
  problem: "Primary problem area",
  crm: "CRM platform",
  scheduling: "Scheduling tool",
  ai: "Chatbot or AI use",
  forms: "Website forms",
  messaging: "Messaging channels",
  leads: "Monthly leads",
  consults: "Monthly consultations",
  clients: "Monthly clients / patients",
  staff: "Staff involved",
  lost: "Where clients get lost",
  followup: "Who handles follow-up",
  afterForm: "After form submission",
  improve: "Workflow improvement goal",
};

export const CONTACT_FORM_SECTIONS: Array<{
  title: string;
  fields: string[];
}> = [
  {
    title: "Organization",
    fields: ["organization_type", "orgType", "role"],
  },
  {
    title: "Current systems",
    fields: ["crm", "scheduling", "ai", "forms", "messaging"],
  },
  {
    title: "Main problem & volume",
    fields: ["problem", "leads", "consults", "clients", "staff"],
  },
  {
    title: "Diagnostic notes",
    fields: ["lost", "followup", "afterForm", "improve"],
  },
];

export const CHAT_ASSESSMENT_SECTIONS: Array<{
  title: string;
  fields: string[];
}> = [
  {
    title: "Organization profile",
    fields: ["organization_type", "role"],
  },
  {
    title: "Workflow pain points",
    fields: ["main_problem", "client_dropoff_stage", "primary_priority"],
  },
  {
    title: "Systems & follow-up",
    fields: ["crm_status", "crm_platform", "tracking_method", "followup_method", "followup_owner"],
  },
  {
    title: "Automation",
    fields: ["ai_automation_status", "chatbot_issues"],
  },
  {
    title: "Volume",
    fields: ["monthly_inquiries"],
  },
];

export function assessmentFieldLabel(field: string) {
  return ASSESSMENT_FIELD_LABELS[field] ?? field.replaceAll("_", " ");
}

export function displayAssessmentAnswer(value: {
  value: string | string[];
  label: string | string[];
  extra?: string;
}) {
  const label = Array.isArray(value.label) ? value.label.join(", ") : value.label;
  if (!label) return "—";
  return value.extra ? `${label} — ${value.extra}` : label;
}
