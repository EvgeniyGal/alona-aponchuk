"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { FunnelStep, NamedCount, ScatterPoint, TimePoint } from "@/lib/admin/analytics";
import { ChartEmpty } from "@/components/admin/analytics/chart-card";
import {
  CHART,
  PALETTE,
  SOURCE_COLORS,
  STATUS_COLORS,
  tooltipLabelStyle,
  tooltipStyle,
} from "@/components/admin/analytics/colors";

function hasValues(rows: Array<{ count?: number; leads?: number; sessions?: number; messages?: number }>) {
  return rows.some((row) => (row.count ?? row.leads ?? row.sessions ?? row.messages ?? 0) > 0);
}

export function ActivityAreaChart({
  data,
  labels,
  empty,
  formatDate,
  series = ["messages", "sessions", "leads"],
}: {
  data: TimePoint[];
  labels: { leads: string; sessions: string; messages: string };
  empty: string;
  formatDate: (value: string) => string;
  series?: Array<"leads" | "sessions" | "messages">;
}) {
  const visible = {
    leads: series.includes("leads"),
    sessions: series.includes("sessions"),
    messages: series.includes("messages"),
  };
  const nonempty = data.some((row) =>
    (visible.leads && row.leads > 0) ||
    (visible.sessions && row.sessions > 0) ||
    (visible.messages && row.messages > 0),
  );
  if (!nonempty) return <ChartEmpty message={empty} />;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="area-sessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.blue} stopOpacity={0.28} />
              <stop offset="100%" stopColor={CHART.blue} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="area-leads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.gold} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART.gold} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="area-messages" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.teal} stopOpacity={0.18} />
              <stop offset="100%" stopColor={CHART.teal} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART.hairline} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: CHART.muted, fontSize: 11 }}
            axisLine={{ stroke: CHART.hairline }}
            tickLine={false}
          />
          <YAxis tick={{ fill: CHART.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            labelFormatter={(value) => formatDate(String(value))}
          />
          <Legend wrapperStyle={{ fontSize: 12.5 }} />
          {visible.messages ? (
            <Area type="monotone" dataKey="messages" name={labels.messages} stroke={CHART.teal} fill="url(#area-messages)" strokeWidth={1.5} />
          ) : null}
          {visible.sessions ? (
            <Area type="monotone" dataKey="sessions" name={labels.sessions} stroke={CHART.blue} fill="url(#area-sessions)" strokeWidth={2} />
          ) : null}
          {visible.leads ? (
            <Area type="monotone" dataKey="leads" name={labels.leads} stroke={CHART.gold} fill="url(#area-leads)" strokeWidth={2} />
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HorizontalBarChart({
  data,
  empty,
  color = CHART.blue,
}: {
  data: Array<{ name: string; count: number }>;
  empty: string;
  color?: string;
}) {
  if (!hasValues(data)) return <ChartEmpty message={empty} />;
  const height = Math.max(240, data.length * 36 + 24);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid stroke={CHART.hairline} horizontal={false} />
          <XAxis type="number" tick={{ fill: CHART.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: CHART.graphite, fontSize: 11.5 }}
            tickFormatter={(value: string) => (value.length > 22 ? `${value.slice(0, 20)}…` : value)}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
          <Bar dataKey="count" fill={color} radius={[0, 8, 8, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({
  data,
  empty,
  colors,
}: {
  data: Array<{ name: string; count: number; key?: string }>;
  empty: string;
  colors?: Record<string, string>;
}) {
  if (!hasValues(data)) return <ChartEmpty message={empty} />;

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={2}
            stroke={CHART.white}
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.key ?? entry.name}
                fill={colors?.[entry.key ?? ""] ?? PALETTE[index % PALETTE.length]}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
          <Legend wrapperStyle={{ fontSize: 12.5 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FunnelBars({
  data,
  empty,
}: {
  data: Array<FunnelStep & { name: string }>;
  empty: string;
}) {
  if (!data.length || data.every((step) => step.count === 0)) return <ChartEmpty message={empty} />;
  const max = Math.max(...data.map((step) => step.count), 1);

  return (
    <div className="space-y-3">
      {data.map((step, index) => {
        const previous = index === 0 ? step.count : data[index - 1].count;
        const rate = index === 0 || previous === 0 ? null : Math.round((step.count / previous) * 100);
        return (
          <div key={step.key}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
              <span className="text-graphite">{step.name}</span>
              <span className="tabular-nums text-muted-foreground">
                {step.count}
                {rate != null ? <span className="ml-2 text-[11.5px] text-teal">{rate}%</span> : null}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ivory">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue to-teal"
                style={{ width: `${Math.max(4, (step.count / max) * 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EngagementScatter({
  data,
  empty,
  labels,
}: {
  data: ScatterPoint[];
  empty: string;
  labels: { converted: string; notConverted: string; messages: string; duration: string };
}) {
  if (!data.length) return <ChartEmpty message={empty} />;
  const converted = data.filter((point) => point.converted);
  const rest = data.filter((point) => !point.converted);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid stroke={CHART.hairline} />
          <XAxis
            type="number"
            dataKey="messages"
            name={labels.messages}
            tick={{ fill: CHART.muted, fontSize: 11 }}
            axisLine={{ stroke: CHART.hairline }}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="number"
            dataKey="durationHours"
            name={labels.duration}
            tick={{ fill: CHART.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <ZAxis range={[48, 48]} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            cursor={{ strokeDasharray: "3 3", stroke: CHART.hairline }}
          />
          <Legend wrapperStyle={{ fontSize: 12.5 }} />
          <Scatter name={labels.notConverted} data={rest} fill={CHART.blue} fillOpacity={0.65} />
          <Scatter name={labels.converted} data={converted} fill={CHART.gold} fillOpacity={0.85} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function statusColors() {
  return STATUS_COLORS;
}

export function sourceColors() {
  return SOURCE_COLORS;
}

export function namedToBars(rows: NamedCount[], nameOf: (key: string) => string) {
  return rows.map((row) => ({ ...row, name: nameOf(row.key) }));
}
