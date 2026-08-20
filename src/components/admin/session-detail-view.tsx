import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { ChatTranscript } from "@/components/admin/chat-transcript";
import {
  assessmentFieldLabel,
  CHAT_ASSESSMENT_SECTIONS,
  displayAssessmentAnswer,
} from "@/lib/admin/lead-fields";
import { formatAdminDateTime } from "@/lib/admin/format-date";
import { truncateId } from "@/lib/admin/chat-session";
import type { AssessmentAnswers, ChatSession } from "@/lib/db/schema";

export type SessionDetailData = {
  id: string;
  visitorId: string | null;
  mode: ChatSession["mode"];
  leadId: string | null;
  leadName: string | null;
  leadEmail: string | null;
  createdAt: string;
  updatedAt: string;
  assessmentAnswers: AssessmentAnswers;
  chatMessages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: string;
  }>;
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-3">
      <dt className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-[14px] text-graphite">{value || "—"}</dd>
    </div>
  );
}

export async function SessionDetailView({ session }: { session: SessionDetailData }) {
  const t = await getTranslations("admin");
  const locale = await getLocale();
  const assessmentItems = CHAT_ASSESSMENT_SECTIONS.flatMap((section) =>
    section.fields
      .map((field) => ({ field, answer: session.assessmentAnswers[field] }))
      .filter((item) => item.answer && displayAssessmentAnswer(item.answer) !== "—"),
  );
  const modeLabel = t(`sessions.modes.${session.mode}`);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/sessions"
          className="inline-flex items-center gap-1.5 text-[13px] text-blue hover:underline"
        >
          <ArrowLeft size={14} />
          {t("sessionDetail.back")}
        </Link>
        <p className="eyebrow mt-4">{t("sessionDetail.title")}</p>
        <h1 className="mt-2 font-display text-3xl">{truncateId(session.id, 12)}</h1>
        <p className="text-[15px] text-muted-foreground">
          {t("sessionDetail.lastActive", { mode: modeLabel, date: formatAdminDateTime(session.updatedAt, locale) })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t("sessionDetail.mode"), value: modeLabel },
          { label: t("sessionDetail.started"), value: formatAdminDateTime(session.createdAt, locale) },
          { label: t("sessionDetail.lastActivity"), value: formatAdminDateTime(session.updatedAt, locale) },
          {
            label: t("sessionDetail.linkedLead"),
            value: session.leadId ? (
              <Link href={`/admin/leads/${session.leadId}`} className="text-blue hover:underline">
                {session.leadName || session.leadEmail || truncateId(session.leadId)}
              </Link>
            ) : (
              t("sessionDetail.none")
            ),
          },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-hairline bg-white p-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-[14px] font-medium text-graphite">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-hairline bg-white p-5">
        <h2 className="font-display text-lg">{t("sessionDetail.metadata")}</h2>
        <dl className="mt-4 space-y-3">
          <InfoRow label={t("sessionDetail.sessionId")} value={<span className="font-mono text-[13px]">{session.id}</span>} />
          <InfoRow
            label={t("sessionDetail.visitorId")}
            value={
              session.visitorId ? (
                <span className="font-mono text-[13px]">{session.visitorId}</span>
              ) : (
                t("sessionDetail.notLinked")
              )
            }
          />
          <InfoRow label={t("sessionDetail.messages")} value={String(session.chatMessages.length)} />
        </dl>
      </section>

      {assessmentItems.length > 0 ? (
        <section className="rounded-xl border border-hairline bg-white p-5">
          <h2 className="font-display text-lg">{t("sessionDetail.assessment")}</h2>
          <dl className="mt-4 space-y-3">
            {assessmentItems.map(({ field, answer }) => (
              <InfoRow
                key={field}
                label={t.has(`leadDetail.fields.${field}`) ? t(`leadDetail.fields.${field}`) : assessmentFieldLabel(field)}
                value={displayAssessmentAnswer(answer!)}
              />
            ))}
          </dl>
        </section>
      ) : null}

      <ChatTranscript
        title={t("sessionDetail.conversation")}
        lines={session.chatMessages.map((message) => ({
          role: message.role,
          content: message.content,
          createdAt: message.createdAt,
        }))}
        emptyMessage={t("sessionDetail.empty")}
      />
    </div>
  );
}
