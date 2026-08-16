import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { updateLeadStatus } from "../actions";

function displayAnswer(value: { value: string | string[]; label: string | string[]; extra?: string }) {
  const label = Array.isArray(value.label) ? value.label.join(", ") : value.label;
  return value.extra ? `${label} — ${value.extra}` : label;
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = getDb();
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) notFound();

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Lead</p>
        <h1 className="mt-2 font-display text-3xl">{lead.fullName}</h1>
        <p className="text-[14px] text-muted-foreground">{lead.organizationName}</p>
      </div>

      <form action={updateLeadStatus} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="id" value={lead.id} />
        <label className="text-[13px] font-medium">Status</label>
        <select
          name="status"
          defaultValue={lead.status}
          className="rounded-md border border-hairline bg-white px-3 py-2 text-[13.5px]"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="call_scheduled">Call Scheduled</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit" className="rounded-md bg-blue px-3 py-2 text-[13px] font-medium text-white">
          Update
        </button>
      </form>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-white p-5">
          <h2 className="font-display text-lg">Contact</h2>
          <dl className="mt-3 space-y-2 text-[14px]">
            <div><span className="text-muted-foreground">Email: </span>{lead.workEmail}</div>
            <div><span className="text-muted-foreground">Phone: </span>{lead.phone || "—"}</div>
            <div><span className="text-muted-foreground">Website: </span>{lead.website || "—"}</div>
            <div><span className="text-muted-foreground">Role: </span>{lead.roleTitle || "—"}</div>
            <div><span className="text-muted-foreground">Source: </span>{lead.source}</div>
            <div><span className="text-muted-foreground">Submitted: </span>{lead.createdAt.toLocaleString()}</div>
          </dl>
        </div>
        <div className="rounded-xl border border-hairline bg-white p-5">
          <h2 className="font-display text-lg">AI summary</h2>
          <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-graphite">
            {lead.diagnosticSummary || "No diagnostic summary for this lead."}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-hairline bg-white p-5">
        <h2 className="font-display text-lg">Assessment responses</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-[14px]">
          {Object.entries(lead.assessmentAnswers).map(([field, answer]) => (
            <div key={field}>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{field.replaceAll("_", " ")}</dt>
              <dd>{displayAnswer(answer)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-xl border border-hairline bg-white p-5">
        <h2 className="font-display text-lg">Transcript</h2>
        <div className="mt-4 space-y-3">
          {lead.transcript.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">No chat transcript.</p>
          ) : (
            lead.transcript.map((line, index) => (
              <div key={`${line.createdAt}-${index}`} className="rounded-lg bg-ivory px-3 py-2 text-[13.5px]">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{line.role}</p>
                <p className="mt-1 whitespace-pre-wrap">{line.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
