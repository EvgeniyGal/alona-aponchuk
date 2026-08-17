"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import {
  BadgeCheck,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
  UserPlus,
  UserRoundX,
  Users,
  Bot,
} from "lucide-react";
import type { KpiKey, KpiMetric } from "@/lib/admin/analytics";
import { CHART } from "@/components/admin/analytics/colors";
import { cn } from "@/lib/utils";

const KPI_ICONS: Record<KpiKey, typeof Users> = {
  leads: UserPlus,
  visitors: Users,
  sessions: MessageSquare,
  assessmentsCompleted: ClipboardCheck,
  chatLeads: Bot,
  conversion: TrendingUp,
  abandon: UserRoundX,
  qualifiedClosed: BadgeCheck,
};

const KPI_ACCENT: Record<KpiKey, string> = {
  leads: "bg-blue-soft text-blue",
  visitors: "bg-teal-soft text-teal",
  sessions: "bg-sage-soft text-graphite",
  assessmentsCompleted: "bg-[#f3ead4] text-[#9a7b2f]",
  chatLeads: "bg-blue-soft text-blue",
  conversion: "bg-teal-soft text-teal",
  abandon: "bg-muted text-muted-foreground",
  qualifiedClosed: "bg-sage-soft text-graphite",
};

export function KpiGrid({
  metrics,
  labels,
  formatNumber,
  formatPercent,
  vsPrevious,
  noChange,
}: {
  metrics: KpiMetric[];
  labels: Record<KpiKey, { title: string; hint: string }>;
  formatNumber: (value: number) => string;
  formatPercent: (value: number) => string;
  vsPrevious: (value: string) => string;
  noChange: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = KPI_ICONS[metric.key];
        const display =
          metric.format === "percent" ? formatPercent(metric.value) : formatNumber(metric.value);
        const deltaGood =
          metric.deltaPct == null
            ? null
            : metric.invertDelta
              ? metric.deltaPct <= 0
              : metric.deltaPct >= 0;
        const spark = metric.sparkline.map((value, index) => ({ index, value }));

        return (
          <Link
            key={metric.key}
            href={metric.href ?? "/admin"}
            className="rounded-xl border border-hairline bg-white p-4 transition hover:border-blue/40 hover:shadow-[0_10px_30px_rgba(31,41,51,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", KPI_ACCENT[metric.key])}>
                <Icon size={16} />
              </div>
              {metric.deltaPct == null ? (
                <span className="text-[11.5px] text-muted-foreground">{noChange}</span>
              ) : (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11.5px] font-medium",
                    deltaGood ? "bg-teal-soft text-teal" : "bg-[#f8e6e4] text-[#b42318]",
                  )}
                >
                  {vsPrevious(formatDelta(metric.deltaPct, formatPercent))}
                </span>
              )}
            </div>
            <p className="mt-3 text-[12.5px] text-muted-foreground">{labels[metric.key].title}</p>
            <p className="mt-1 font-display text-[28px] leading-none text-graphite">{display}</p>
            <p className="mt-1 text-[11.5px] text-muted-foreground">{labels[metric.key].hint}</p>
            <div className="mt-3 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spark} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`kpi-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART.blue} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={CHART.blue} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={CHART.blue}
                    strokeWidth={1.5}
                    fill={`url(#kpi-${metric.key})`}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function formatDelta(value: number, formatPercent: (value: number) => string) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatPercent(value / 100)}`;
}
