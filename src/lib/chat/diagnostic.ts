import type { AssessmentAnswers } from "@/lib/db/schema";
import { getChatCatalog } from "@/i18n/catalog";
import type { AppLocale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

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

export function ruleBasedDiagnostic(answers: AssessmentAnswers, locale: AppLocale = defaultLocale) {
  const d = getChatCatalog(locale).diagnostic;
  const problems = (labelOf(answers, "main_problem") || d.defaultProblems).toLowerCase();
  const dropoff = labelOf(answers, "client_dropoff_stage");
  const followup = valueOf(answers, "followup_method");
  const crm = valueOf(answers, "crm_status");
  const tracking = labelOf(answers, "tracking_method");
  const platform = labelOf(answers, "crm_platform");

  const core =
    followup === "manual" || followup === "inconsistent" || followup === "no_process"
      ? d.coreManual.replace("{problems}", problems)
      : d.coreDefault.replace("{problems}", problems);

  const why =
    dropoff && dropoff !== "Not Sure" && dropoff !== "Не впевнений" && dropoff !== "Не уверен"
      ? d.whyDropoff.replace("{dropoff}", dropoff.toLowerCase())
      : d.whyDefault;

  let secondary = d.secondaryDefault;
  if (crm === "no" || tracking) {
    secondary = tracking
      ? d.secondaryTracking.replace("{tracking}", tracking.toLowerCase())
      : d.secondaryNoCrm;
  } else if (platform) {
    secondary = d.secondaryPlatform.replace("{platform}", platform);
  } else if (crm === "yes") {
    secondary = d.secondaryCrm;
  }

  return `${core}${why}${secondary}${d.auditClose}`;
}

export function formatAnswerLabels(answers: AssessmentAnswers) {
  const lines: string[] = [];
  for (const [field, entry] of Object.entries(answers)) {
    const label = Array.isArray(entry.label) ? entry.label.join(", ") : entry.label;
    lines.push(`${field}: ${label}${entry.extra ? ` (${entry.extra})` : ""}`);
  }
  return lines.join("\n");
}
