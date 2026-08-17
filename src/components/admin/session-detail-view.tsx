import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChatTranscript } from "@/components/admin/chat-transcript";
import {
  assessmentFieldLabel,
  CHAT_ASSESSMENT_SECTIONS,
  displayAssessmentAnswer,
} from "@/lib/admin/lead-fields";
import { formatAdminDateTime } from "@/lib/admin/format-date";
import { formatChatMode, truncateId } from "@/lib/admin/chat-session";
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

export function SessionDetailView({ session }: { session: SessionDetailData }) {
  const assessmentItems = CHAT_ASSESSMENT_SECTIONS.flatMap((section) =>
    section.fields
      .map((field) => ({ field, answer: session.assessmentAnswers[field] }))
      .filter((item) => item.answer && displayAssessmentAnswer(item.answer) !== "—"),
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/sessions"
          className="inline-flex items-center gap-1.5 text-[13px] text-blue hover:underline"
        >
          <ArrowLeft size={14} />
          Back to sessions
        </Link>
        <p className="eyebrow mt-4">Chat session</p>
        <h1 className="mt-2 font-display text-3xl">{truncateId(session.id, 12)}</h1>
        <p className="text-[15px] text-muted-foreground">
          {formatChatMode(session.mode)} · Last active {formatAdminDateTime(session.updatedAt)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Mode", value: formatChatMode(session.mode) },
          { label: "Started", value: formatAdminDateTime(session.createdAt) },
          { label: "Last activity", value: formatAdminDateTime(session.updatedAt) },
          {
            label: "Linked lead",
            value: session.leadId ? (
              <Link href={`/admin/leads/${session.leadId}`} className="text-blue hover:underline">
                {session.leadName || session.leadEmail || truncateId(session.leadId)}
              </Link>
            ) : (
              "None"
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
        <h2 className="font-display text-lg">Session metadata</h2>
        <dl className="mt-4 space-y-3">
          <InfoRow label="Session ID" value={<span className="font-mono text-[13px]">{session.id}</span>} />
          <InfoRow
            label="Visitor ID"
            value={
              session.visitorId ? (
                <span className="font-mono text-[13px]">{session.visitorId}</span>
              ) : (
                "Not linked"
              )
            }
          />
          <InfoRow label="Messages" value={String(session.chatMessages.length)} />
        </dl>
      </section>

      {assessmentItems.length > 0 ? (
        <section className="rounded-xl border border-hairline bg-white p-5">
          <h2 className="font-display text-lg">Assessment answers</h2>
          <dl className="mt-4 space-y-3">
            {assessmentItems.map(({ field, answer }) => (
              <InfoRow
                key={field}
                label={assessmentFieldLabel(field)}
                value={displayAssessmentAnswer(answer!)}
              />
            ))}
          </dl>
        </section>
      ) : null}

      <ChatTranscript
        title="Chat conversation"
        lines={session.chatMessages.map((message) => ({
          role: message.role,
          content: message.content,
          createdAt: message.createdAt,
        }))}
        emptyMessage="No messages recorded for this session."
      />
    </div>
  );
}
