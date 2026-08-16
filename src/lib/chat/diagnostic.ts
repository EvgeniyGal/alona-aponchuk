import type { AssessmentAnswers } from "@/lib/db/schema";

function labelOf(answers: AssessmentAnswers, field: string) {
  const entry = answers[field];
  if (!entry) return "";
  const label = Array.isArray(entry.label) ? entry.label.join(", ") : entry.label;
  return entry.extra ? `${label}: ${entry.extra}` : label;
}

function valueOf(answers: AssessmentAnswers, field: string) {
  const entry = answers[field];
  if (!entry) return "";
  return Array.isArray(entry.value) ? entry.value.join(",") : String(entry.value);
}

export function ruleBasedDiagnostic(answers: AssessmentAnswers) {
  const problems = labelOf(answers, "main_problem") || "workflow gaps between inquiry and follow-up";
  const dropoff = labelOf(answers, "client_dropoff_stage");
  const followup = valueOf(answers, "followup_method");
  const crm = valueOf(answers, "crm_status");
  const tracking = labelOf(answers, "tracking_method");
  const platform = labelOf(answers, "crm_platform");

  const core =
    followup === "manual" || followup === "inconsistent" || followup === "no_process"
      ? `Based on your answers, the main issue appears to be ${problems.toLowerCase()}, with follow-up that is still largely manual or inconsistent.`
      : `Based on your answers, the main issue appears to be ${problems.toLowerCase()}.`;

  const why =
    dropoff && dropoff !== "Not Sure"
      ? ` Clients most often stall ${dropoff.toLowerCase()}, which can delay response time and leave qualified inquiries unworked.`
      : ` When intake, scheduling, and follow-up are not tightly connected, staff repeat manual work and some inquiries never convert.`;

  let secondary = "It may also be worth reviewing how inquiry data is captured and handed off between staff.";
  if (crm === "no" || tracking) {
    secondary = tracking
      ? ` It may also be worth reviewing how inquiries are tracked today (${tracking.toLowerCase()}) and whether that process can support consistent handoffs.`
      : " It may also be worth reviewing how inquiries are tracked without a structured CRM or EHR workflow.";
  } else if (platform) {
    secondary = ` It may also be worth reviewing how ${platform} is connected to scheduling and follow-up, so the system matches the real client journey.`;
  } else if (crm === "yes") {
    secondary =
      " It may also be worth reviewing how your CRM and scheduling process are connected, so status changes and staff tasks stay aligned.";
  }

  return `${core}${why}${secondary} A Workflow Audit can help map this process and identify what can be improved or automated.`;
}

export function formatAnswerLabels(answers: AssessmentAnswers) {
  const lines: string[] = [];
  for (const [field, entry] of Object.entries(answers)) {
    const label = Array.isArray(entry.label) ? entry.label.join(", ") : entry.label;
    lines.push(`${field}: ${label}${entry.extra ? ` (${entry.extra})` : ""}`);
  }
  return lines.join("\n");
}
