import { getTranslations } from "next-intl/server";
import { AnalyticsDashboard } from "@/components/admin/analytics/dashboard";
import { PeriodFilter } from "@/components/admin/analytics/period-filter";
import { getAnalyticsDashboard, parseAnalyticsRange, type AnalyticsRange } from "@/lib/admin/analytics";
import { requireAdmin } from "@/lib/admin/require-admin";

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  await requireAdmin();
  const t = await getTranslations("admin.stats");
  const params = await searchParams;
  const range = parseAnalyticsRange(params.range);
  const data = await getAnalyticsDashboard(range);

  const rangeLabels = {
    "7d": t("range.7d"),
    "30d": t("range.30d"),
    "90d": t("range.90d"),
    all: t("range.all"),
  } satisfies Record<AnalyticsRange, string>;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{t("title")}</h1>
          <p className="mt-2 max-w-2xl text-[14px] text-muted-foreground">{t("lead")}</p>
        </div>
        <PeriodFilter range={range} labels={rangeLabels} />
      </div>
      <div className="mt-8">
        <AnalyticsDashboard data={data} />
      </div>
    </div>
  );
}
