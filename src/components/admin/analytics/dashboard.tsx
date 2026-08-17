"use client";

import { useLocale, useTranslations } from "next-intl";
import type { AnalyticsDashboardData, KpiKey } from "@/lib/admin/analytics";
import { LEAD_STATUS_I18N_KEYS, type LeadStatus } from "@/lib/admin/lead-status";
import { ChartCard } from "@/components/admin/analytics/chart-card";
import {
  ActivityAreaChart,
  DonutChart,
  EngagementScatter,
  FunnelBars,
  HorizontalBarChart,
  namedToBars,
  sourceColors,
  statusColors,
} from "@/components/admin/analytics/charts";
import { ActivityHeatmap } from "@/components/admin/analytics/heatmap";
import { KpiGrid } from "@/components/admin/analytics/kpi-grid";
import { CHART } from "@/components/admin/analytics/colors";

const FIELD_QUESTION: Record<string, string> = {
  organization_type: "q1",
  role: "q2",
  main_problem: "q3",
  client_dropoff_stage: "q4",
  crm_status: "q5",
  followup_method: "q6",
  ai_automation_status: "q7",
  chatbot_issues: "q7a",
  monthly_inquiries: "q8",
  primary_priority: "q9",
};

export function AnalyticsDashboard({ data }: { data: AnalyticsDashboardData }) {
  const t = useTranslations("admin");
  const tStats = useTranslations("admin.stats");
  const tChat = useTranslations("chat");
  const locale = useLocale();
  const empty = tStats("empty");
  const { formatNumber, formatPercent } = numberFormatters(locale);

  const kpiLabels = Object.fromEntries(
    data.kpis.map((metric) => [
      metric.key,
      { title: tStats(`kpi.${metric.key}`), hint: tStats(`kpiHint.${metric.key}`) },
    ]),
  ) as Record<KpiKey, { title: string; hint: string }>;

  const pipeline = namedToBars(data.pipeline, (key) =>
    t(`leads.${LEAD_STATUS_I18N_KEYS[key as LeadStatus]}`),
  );
  const sources = namedToBars(data.sources, (key) =>
    key === "contact_form" ? t("leads.sourceContact") : t("leads.sourceChat"),
  );
  const modes = namedToBars(data.modes, (key) => t(`sessions.modes.${key}`));
  const locales = namedToBars(data.locales, (key) =>
    tStats.has(`locales.${key}`) ? tStats(`locales.${key}`) : key,
  );
  const funnel = data.funnel.map((step) => ({ ...step, name: tStats(`funnel.${step.key}`) }));
  const dropoff = data.dropoff.map((step) => ({ ...step, name: tStats(`fields.${step.key}`) }));

  return (
    <div className="space-y-6">
      <KpiGrid
        metrics={data.kpis}
        labels={kpiLabels}
        formatNumber={formatNumber}
        formatPercent={formatPercent}
        vsPrevious={(value) => tStats("vsPrevious", { value })}
        noChange={tStats("noChange")}
      />

      <ChartCard title={tStats("sections.funnel")} description={tStats("sections.funnelLead")}>
        <FunnelBars data={funnel} empty={empty} />
      </ChartCard>

      <ChartCard
        title={tStats("sections.activity")}
        footer={
          <div className="grid gap-3 sm:grid-cols-4">
            <MiniStat label={tStats("avgTimeToLead")} value={formatHours(data.timeToLeadHours.avg, tStats)} />
            <MiniStat label={tStats("medianTimeToLead")} value={formatHours(data.timeToLeadHours.median, tStats)} />
            <MiniStat label={tStats("avgMessages")} value={formatNumber(data.avgMessages)} />
            <MiniStat label={tStats("medianDuration")} value={formatHours(data.medianDurationHours, tStats)} />
          </div>
        }
      >
        <ActivityAreaChart
          data={data.activity}
          labels={{
            leads: tStats("series.leads"),
            sessions: tStats("series.sessions"),
            messages: tStats("series.messages"),
          }}
          empty={empty}
          formatDate={(value) => formatAxisDate(value, locale)}
        />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title={tStats("sections.pipeline")} description={tStats("sections.pipelineLead")}>
          <DonutChart data={pipeline} empty={empty} colors={statusColors()} />
        </ChartCard>
        <ChartCard title={tStats("sections.source")}>
          <DonutChart data={sources} empty={empty} colors={sourceColors()} />
        </ChartCard>
        <ChartCard title={tStats("sections.notifications")}>
          <DonutChart
            data={[
              { key: "notified", name: tStats("notified"), count: data.notifications.notified },
              { key: "pending", name: tStats("pending"), count: data.notifications.pending },
            ]}
            empty={empty}
            colors={{ notified: CHART.teal, pending: CHART.gold }}
          />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title={tStats("sections.modes")}>
          <HorizontalBarChart data={modes} empty={empty} color={CHART.blue} />
        </ChartCard>
        <ChartCard title={tStats("sections.locales")}>
          <HorizontalBarChart data={locales} empty={empty} color={CHART.teal} />
        </ChartCard>
      </div>

      <ChartCard title={tStats("sections.dropoff")} description={tStats("sections.dropoffLead")}>
        <FunnelBars data={dropoff} empty={empty} />
      </ChartCard>

      {data.insights.length > 0 ? (
        <div>
          <h2 className="font-display text-xl text-graphite">{tStats("sections.insights")}</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">{tStats("sections.insightsLead")}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {data.insights.map((chart) => (
              <ChartCard key={chart.field} title={tStats(`fields.${chart.field}`)}>
                <HorizontalBarChart
                  data={chart.buckets.map((bucket) => ({
                    name: optionLabel(tChat, tStats, chart.questionId ?? FIELD_QUESTION[chart.field], bucket.value),
                    count: bucket.count,
                  }))}
                  empty={empty}
                  color={CHART.sage}
                />
              </ChartCard>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title={tStats("sections.messages")} description={tStats("sections.messagesLead")}>
          <ActivityAreaChart
            data={data.activity}
            labels={{
              leads: tStats("series.leads"),
              sessions: tStats("series.sessions"),
              messages: tStats("series.messages"),
            }}
            empty={empty}
            formatDate={(value) => formatAxisDate(value, locale)}
            series={["messages"]}
          />
        </ChartCard>
        <ChartCard title={tStats("sections.heatmap")} description={tStats("sections.heatmapLead")}>
          <ActivityHeatmap
            data={data.heatmap}
            empty={empty}
            days={[
              tStats("days.sun"),
              tStats("days.mon"),
              tStats("days.tue"),
              tStats("days.wed"),
              tStats("days.thu"),
              tStats("days.fri"),
              tStats("days.sat"),
            ]}
          />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title={tStats("sections.scatter")} description={tStats("sections.scatterLead")}>
          <EngagementScatter
            data={data.scatter}
            empty={empty}
            labels={{
              converted: tStats("converted"),
              notConverted: tStats("notConverted"),
              messages: tStats("messagesAxis"),
              duration: tStats("durationAxis"),
            }}
          />
        </ChartCard>
        <ChartCard title={tStats("sections.returning")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DonutChart
              data={[
                { key: "new", name: tStats("newVisitors"), count: data.returning.newVisitors },
                { key: "returning", name: tStats("returningVisitors"), count: data.returning.returningVisitors },
              ]}
              empty={empty}
              colors={{ new: CHART.blue, returning: CHART.gold }}
            />
            <DonutChart
              data={[
                { key: "withLead", name: t("sessions.withLead"), count: data.withLead },
                { key: "withoutLead", name: t("sessions.noLead"), count: data.withoutLead },
              ]}
              empty={empty}
              colors={{ withLead: CHART.teal, withoutLead: CHART.muted }}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11.5px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display text-lg text-graphite">{value}</p>
    </div>
  );
}

function numberFormatters(locale: string) {
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const whole = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const percent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 });
  return {
    formatNumber: (value: number) => (Number.isInteger(value) ? whole.format(value) : number.format(value)),
    formatPercent: (value: number) => percent.format(value),
  };
}

function formatAxisDate(value: string, locale: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatHours(
  hours: number | null,
  t: ReturnType<typeof useTranslations>,
) {
  if (hours == null) return "—";
  if (hours < 1) return t("minutes", { value: Math.max(1, Math.round(hours * 60)) });
  return t("hours", { value: hours.toFixed(1) });
}

function optionLabel(
  tChat: ReturnType<typeof useTranslations>,
  tStats: ReturnType<typeof useTranslations>,
  questionId: string | undefined,
  value: string,
) {
  if (questionId) {
    const compact = `questions.${questionId}.compact.${value}`;
    if (tChat.has(compact)) return tChat(compact);
    const key = `questions.${questionId}.options.${value}`;
    if (tChat.has(key)) return tChat(key);
  }
  if (value === "other") return tStats("other");
  return value.replaceAll("_", " ");
}
