import Link from "next/link";
import { desc } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { LEAD_STATUSES, LEAD_STATUS_CONFIG, LEAD_STATUS_I18N_KEYS, type LeadStatus } from "@/lib/admin/lead-status";
import { LeadsTable, type LeadRow } from "@/components/admin/leads-table";
import { cn } from "@/lib/utils";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; source?: string }>;
}) {
  await requireAdmin();
  const t = await getTranslations("admin");
  const params = await searchParams;
  const db = getDb();
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));

  const filtered = rows.filter((lead) => {
    if (params.status && lead.status !== params.status) return false;
    if (params.source && lead.source !== params.source) return false;
    return true;
  });

  const tableData: LeadRow[] = filtered.map((lead) => ({
    id: lead.id,
    fullName: lead.fullName,
    organizationName: lead.organizationName,
    workEmail: lead.workEmail,
    source: lead.source,
    status: lead.status as LeadStatus,
    createdAt: lead.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{t("leads.title")}</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">{t("leads.lead")}</p>
        </div>
        <p className="text-[13px] text-muted-foreground">
          {filtered.length === 1
            ? t("leads.count", { count: filtered.length })
            : t("leads.countPlural", { count: filtered.length })}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-[13px]">
        <Link
          href="/admin/leads"
          className={cn(
            "rounded-full border px-3 py-1 hover:border-blue",
            !params.status ? "border-blue bg-blue-soft/50 text-blue" : "border-hairline",
          )}
        >
          {t("leads.all")}
        </Link>
        {LEAD_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/leads?status=${status}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 hover:border-blue",
              params.status === status ? LEAD_STATUS_CONFIG[status].badge : "border-hairline",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", LEAD_STATUS_CONFIG[status].dot)} />
            {t(`leads.${LEAD_STATUS_I18N_KEYS[status]}`)}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <LeadsTable key={`${params.status ?? "all"}-${params.source ?? "all"}`} data={tableData} />
      </div>
    </div>
  );
}
