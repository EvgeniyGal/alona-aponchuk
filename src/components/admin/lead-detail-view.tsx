"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { updateLeadStatusById } from "@/app/admin/leads/actions";
import { DeleteLeadButton } from "@/components/admin/delete-lead-button";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import {
  assessmentFieldLabel,
  CHAT_ASSESSMENT_SECTIONS,
  CONTACT_FORM_SECTIONS,
  displayAssessmentAnswer,
} from "@/lib/admin/lead-fields";
import {
  isLeadStatus,
  LEAD_STATUSES,
  LEAD_STATUS_CONFIG,
  LEAD_STATUS_I18N_KEYS,
  type LeadStatus,
} from "@/lib/admin/lead-status";
import { formatAdminDateTime } from "@/lib/admin/format-date";
import type { AssessmentAnswers, TranscriptLine } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { ChatTranscript } from "@/components/admin/chat-transcript";

type ChatMessageRow = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};

export type LeadDetailData = {
  id: string;
  source: "chat_assessment" | "contact_form";
  status: LeadStatus;
  fullName: string;
  organizationName: string;
  workEmail: string;
  phone: string | null;
  website: string | null;
  roleTitle: string | null;
  consentAt: string;
  createdAt: string;
  updatedAt: string;
  notifiedAt: string | null;
  diagnosticSummary: string | null;
  assessmentAnswers: AssessmentAnswers;
  transcript: TranscriptLine[];
  sessionId: string | null;
  chatMessages: ChatMessageRow[];
};

function fieldLabel(t: ReturnType<typeof useTranslations<"admin">>, field: string) {
  return t.has(`leadDetail.fields.${field}`) ? t(`leadDetail.fields.${field}`) : assessmentFieldLabel(field);
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-3">
      <dt className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-[14px] text-graphite">{value || "—"}</dd>
    </div>
  );
}

function AssessmentSections({
  answers,
  source,
}: {
  answers: AssessmentAnswers;
  source: LeadDetailData["source"];
}) {
  const t = useTranslations("admin");
  const sections = source === "contact_form" ? CONTACT_FORM_SECTIONS : CHAT_ASSESSMENT_SECTIONS;
  const covered = new Set(sections.flatMap((section) => section.fields));

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const items = section.fields
          .map((field) => ({ field, answer: answers[field] }))
          .filter((item) => item.answer && displayAssessmentAnswer(item.answer) !== "—");

        if (items.length === 0) return null;

        return (
          <div key={section.titleKey}>
            <h3 className="font-display text-base text-graphite">{t(`leadDetail.sections.${section.titleKey}`)}</h3>
            <dl className="mt-3 space-y-3">
              {items.map(({ field, answer }) => (
                <InfoRow key={field} label={fieldLabel(t, field)} value={displayAssessmentAnswer(answer!)} />
              ))}
            </dl>
          </div>
        );
      })}

      {Object.entries(answers)
        .filter(([field]) => !covered.has(field))
        .filter(([, answer]) => displayAssessmentAnswer(answer) !== "—")
        .map(([field, answer]) => (
          <InfoRow key={field} label={fieldLabel(t, field)} value={displayAssessmentAnswer(answer)} />
        ))}
    </div>
  );
}

function StatusEditor({ leadId, initialStatus }: { leadId: string; initialStatus: LeadStatus }) {
  const t = useTranslations("admin");
  const common = useTranslations("common");
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();
  const config = LEAD_STATUS_CONFIG[status];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <LeadStatusBadge status={status} />
      <select
        value={status}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value;
          if (!isLeadStatus(next) || next === status) return;
          startTransition(async () => {
            const result = await updateLeadStatusById(leadId, next);
            if (result.ok) setStatus(next);
          });
        }}
        className={cn(
          "rounded-md border px-3 py-2 text-[13.5px] font-medium outline-none focus:ring-2 focus:ring-blue/20 disabled:opacity-60",
          config.select,
        )}
      >
        {LEAD_STATUSES.map((item) => (
          <option key={item} value={item}>
            {t(`leads.${LEAD_STATUS_I18N_KEYS[item]}`)}
          </option>
        ))}
      </select>
      {pending ? <span className="text-[12px] text-muted-foreground">{common("saving")}</span> : null}
    </div>
  );
}

export function LeadDetailView({ lead }: { lead: LeadDetailData }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const transcriptLines =
    lead.chatMessages.length > 0
      ? lead.chatMessages.map((message) => ({
          role: message.role,
          content: message.content,
          createdAt: message.createdAt,
        }))
      : lead.transcript;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 text-[13px] text-blue hover:underline"
          >
            <ArrowLeft size={14} />
            {t("leadDetail.back")}
          </Link>
          <p className="eyebrow mt-4">{t("leadDetail.profile")}</p>
          <h1 className="mt-2 font-display text-3xl">{lead.fullName}</h1>
          <p className="text-[15px] text-muted-foreground">{lead.organizationName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusEditor leadId={lead.id} initialStatus={lead.status} />
          <DeleteLeadButton
            leadId={lead.id}
            leadName={lead.fullName}
            variant="button"
            onDeleted={() => router.push("/admin/leads")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: t("leads.source"),
            value: lead.source === "contact_form" ? t("leads.sourceContact") : t("leads.sourceChat"),
          },
          { label: t("leadDetail.submitted"), value: formatAdminDateTime(lead.createdAt, locale) },
          { label: t("leadDetail.consent"), value: formatAdminDateTime(lead.consentAt, locale) },
          {
            label: t("leadDetail.notifications"),
            value: lead.notifiedAt
              ? t("leadDetail.notifiedAt", { date: formatAdminDateTime(lead.notifiedAt, locale) })
              : t("leadDetail.notNotified"),
          },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-hairline bg-white p-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-[14px] font-medium text-graphite">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-hairline bg-white p-5">
        <h2 className="font-display text-lg">{t("leadDetail.contactDetails")}</h2>
        <dl className="mt-4 space-y-3">
          <InfoRow
            label={t("leadDetail.workEmail")}
            value={
              <a href={`mailto:${lead.workEmail}`} className="text-blue hover:underline">
                {lead.workEmail}
              </a>
            }
          />
          <InfoRow label={t("leadDetail.phone")} value={lead.phone} />
          <InfoRow
            label={t("leadDetail.website")}
            value={
              lead.website ? (
                <a
                  href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue hover:underline"
                >
                  {lead.website}
                </a>
              ) : null
            }
          />
          <InfoRow label={t("leadDetail.roleTitle")} value={lead.roleTitle} />
        </dl>
      </section>

      <section className="rounded-xl border border-hairline bg-white p-5">
        <h2 className="font-display text-lg">
          {lead.source === "contact_form" ? t("leadDetail.contactRequestTitle") : t("leadDetail.assessmentTitle")}
        </h2>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          {lead.source === "contact_form" ? t("leadDetail.contactRequestLead") : t("leadDetail.assessmentLead")}
        </p>
        <div className="mt-5">
          <AssessmentSections answers={lead.assessmentAnswers} source={lead.source} />
        </div>
      </section>

      <section className="rounded-xl border border-hairline bg-white p-5">
        <h2 className="font-display text-lg">{t("leadDetail.diagnosticTitle")}</h2>
        <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-graphite">
          {lead.diagnosticSummary ||
            (lead.source === "contact_form" ? t("leadDetail.diagnosticEmptyContact") : t("leadDetail.diagnosticEmptyChat"))}
        </p>
      </section>

      <ChatTranscript
        title={lead.source === "contact_form" ? t("leadDetail.relatedChat") : t("leadDetail.conversation")}
        lines={transcriptLines}
        emptyMessage={t("leadDetail.emptyTranscript")}
      />
    </div>
  );
}
