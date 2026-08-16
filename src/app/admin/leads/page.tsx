import Link from "next/link";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";

const statuses = ["new", "contacted", "call_scheduled", "qualified", "closed"] as const;

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; source?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const db = getDb();
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  const filtered = rows.filter((lead) => {
    if (params.status && lead.status !== params.status) return false;
    if (params.source && lead.source !== params.source) return false;
    return true;
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Leads</h1>
      <p className="mt-2 text-[14px] text-muted-foreground">Chat assessments and contact-form requests.</p>
      <div className="mt-6 flex flex-wrap gap-2 text-[13px]">
        <Link href="/admin/leads" className="rounded-full border border-hairline px-3 py-1 hover:border-blue">
          All
        </Link>
        {statuses.map((status) => (
          <Link
            key={status}
            href={`/admin/leads?status=${status}`}
            className="rounded-full border border-hairline px-3 py-1 capitalize hover:border-blue"
          >
            {formatStatus(status)}
          </Link>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-hairline bg-white">
        <table className="w-full min-w-[720px] text-left text-[13.5px]">
          <thead className="border-b border-hairline bg-ivory/80 text-[12px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-hairline last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-blue hover:underline">
                    {lead.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3">{lead.organizationName}</td>
                <td className="px-4 py-3">{lead.workEmail}</td>
                <td className="px-4 py-3">{lead.source === "contact_form" ? "Contact form" : "Chat"}</td>
                <td className="px-4 py-3 capitalize">{formatStatus(lead.status)}</td>
                <td className="px-4 py-3 text-muted-foreground">{lead.createdAt.toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No leads yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
