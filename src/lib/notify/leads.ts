import { and, eq, isNotNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads, users, type Lead } from "@/lib/db/schema";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { getLeadNotificationEmails } from "@/lib/notify/settings";
import { leadDetailsUrl, leadSummaryText, sendTelegramMessage } from "@/lib/notify/telegram";

function label(lead: Lead, field: string) {
  const entry = lead.assessmentAnswers[field];
  if (!entry) return "";
  const text = Array.isArray(entry.label) ? entry.label.join(", ") : entry.label;
  return entry.extra ? `${text}: ${entry.extra}` : text;
}

function transcriptText(lead: Lead) {
  return lead.transcript
    .map((line) => `${line.role === "assistant" ? "Assistant" : "Visitor"}: ${line.content}`)
    .join("\n\n")
    .slice(0, 12000);
}

export async function notifyNewLead(lead: Lead, options: { email?: boolean } = {}) {
  const sendEmail = options.email !== false;
  const header =
    lead.source === "contact_form" ? "New Workflow Audit Request" : "New Workflow Assessment Lead";

  if (sendEmail) {
    try {
      const to = await getLeadNotificationEmails();
      await sendTemplateEmail("new-assessment-lead", to, {
        replyTo: lead.workEmail,
        templateData: {
          header,
          fullName: lead.fullName,
          organizationName: lead.organizationName,
          roleTitle: lead.roleTitle ?? "",
          workEmail: lead.workEmail,
          phone: lead.phone ?? "",
          website: lead.website ?? "",
          source: lead.source,
          status: lead.status,
          organizationType: label(lead, "organization_type") || label(lead, "orgType"),
          mainProblem: label(lead, "main_problem") || label(lead, "problem"),
          dropoffStage: label(lead, "client_dropoff_stage") || label(lead, "lost"),
          crm: label(lead, "crm_platform") || label(lead, "crm"),
          trackingMethod: label(lead, "tracking_method") || label(lead, "scheduling"),
          followupProcess: [label(lead, "followup_method"), label(lead, "followup_owner"), label(lead, "followup")]
            .filter(Boolean)
            .join(" · "),
          aiStatus: label(lead, "ai_automation_status") || label(lead, "ai"),
          monthlyVolume: label(lead, "monthly_inquiries") || label(lead, "leads"),
          primaryPriority: label(lead, "primary_priority") || label(lead, "improve"),
          diagnosticSummary: lead.diagnosticSummary ?? "",
          transcript: transcriptText(lead),
          detailsUrl: leadDetailsUrl(lead.id),
          submittedAt: lead.createdAt.toISOString(),
        },
      });
    } catch (error) {
      console.error("[notify] Mailgun failed:", error);
    }
  }

  const db = getDb();
  const recipients = await db
    .select({
      id: users.id,
      telegramChatId: users.telegramChatId,
    })
    .from(users)
    .where(and(eq(users.approved, true), isNotNull(users.telegramChatId)));

  const text = leadSummaryText(lead);
  const detailsUrl = leadDetailsUrl(lead.id);

  for (const recipient of recipients) {
    if (!recipient.telegramChatId) continue;
    try {
      await sendTelegramMessage(recipient.telegramChatId, text, detailsUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (/blocked|forbidden|chat not found/i.test(message)) {
        await db
          .update(users)
          .set({
            telegramUserId: null,
            telegramChatId: null,
            telegramUsername: null,
            telegramLinkedAt: null,
          })
          .where(eq(users.id, recipient.id));
      }
      console.error("[notify] Telegram failed:", error);
    }
  }

  await db.update(leads).set({ notifiedAt: new Date() }).where(eq(leads.id, lead.id));
}
