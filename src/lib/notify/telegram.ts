import type { Lead } from "@/lib/db/schema";
import { siteUrl } from "@/lib/site-url";

const API = "https://api.telegram.org";

export function botUsername() {
  return (process.env.TELEGRAM_BOT_USERNAME || "").replace(/^@/, "");
}

export function connectDeepLink(token: string) {
  const username = botUsername();
  if (!username) throw new Error("TELEGRAM_BOT_USERNAME is not configured");
  return `https://t.me/${username}?start=${encodeURIComponent(token)}`;
}

async function telegramRequest(method: string, body: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const res = await fetch(`${API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok) {
    const error = new Error(json.description || `Telegram ${method} failed`);
    (error as Error & { telegram?: unknown }).telegram = json;
    throw error;
  }
  return json;
}

export async function sendTelegramMessage(chatId: string, text: string, detailsUrl?: string) {
  return telegramRequest("sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
    reply_markup: detailsUrl
      ? {
          inline_keyboard: [[{ text: "Open details", url: detailsUrl }]],
        }
      : undefined,
  });
}

function answerLabel(lead: Lead, field: string) {
  const entry = lead.assessmentAnswers[field];
  if (!entry) return "";
  const label = Array.isArray(entry.label) ? entry.label.join(", ") : entry.label;
  return entry.extra ? `${label} (${entry.extra})` : label;
}

export function leadSummaryText(lead: Lead) {
  const header =
    lead.source === "contact_form" ? "New Workflow Audit Request" : "New Workflow Assessment Lead";
  const lines = [
    header,
    "",
    `Name: ${lead.fullName}`,
    `Organization: ${lead.organizationName}`,
    lead.roleTitle ? `Role: ${lead.roleTitle}` : "",
    `Email: ${lead.workEmail}`,
    lead.phone ? `Phone: ${lead.phone}` : "",
    answerLabel(lead, "main_problem") || answerLabel(lead, "problem")
      ? `Main problem: ${answerLabel(lead, "main_problem") || answerLabel(lead, "problem")}`
      : "",
    answerLabel(lead, "client_dropoff_stage")
      ? `Drop-off: ${answerLabel(lead, "client_dropoff_stage")}`
      : "",
    answerLabel(lead, "monthly_inquiries") ? `Volume: ${answerLabel(lead, "monthly_inquiries")}` : "",
    lead.diagnosticSummary ? `Summary: ${lead.diagnosticSummary.slice(0, 280)}` : "",
    `Status: ${lead.status.replace("_", " ")}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function leadDetailsUrl(leadId: string) {
  return `${siteUrl()}/admin/leads/${leadId}`;
}
