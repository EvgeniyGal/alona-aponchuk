import { count, gte, sql } from "drizzle-orm";
import { LEAD_STATUSES } from "@/lib/admin/lead-status";
import { getDb } from "@/lib/db";
import {
  chatMessages,
  chatSessions,
  leads,
  type AssessmentAnswers,
} from "@/lib/db/schema";

export const ANALYTICS_RANGES = ["7d", "30d", "90d", "all"] as const;
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

export type KpiKey =
  | "leads"
  | "visitors"
  | "sessions"
  | "assessmentsCompleted"
  | "chatLeads"
  | "conversion"
  | "abandon"
  | "qualifiedClosed";

export type KpiMetric = {
  key: KpiKey;
  value: number;
  previous: number | null;
  deltaPct: number | null;
  format: "number" | "percent";
  invertDelta?: boolean;
  href?: string;
  sparkline: number[];
};

export type NamedCount = {
  key: string;
  count: number;
};

export type FunnelStep = {
  key: string;
  count: number;
};

export type TimePoint = {
  date: string;
  leads: number;
  sessions: number;
  messages: number;
};

export type ScatterPoint = {
  messages: number;
  durationHours: number;
  converted: boolean;
};

export type HeatmapCell = {
  dow: number;
  hour: number;
  count: number;
};

export type InsightChart = {
  field: string;
  questionId: string | null;
  buckets: Array<{ value: string; count: number }>;
};

export type AnalyticsDashboardData = {
  range: AnalyticsRange;
  bucket: "day" | "week";
  kpis: KpiMetric[];
  activity: TimePoint[];
  funnel: FunnelStep[];
  dropoff: FunnelStep[];
  pipeline: NamedCount[];
  sources: NamedCount[];
  modes: NamedCount[];
  locales: NamedCount[];
  notifications: { notified: number; pending: number };
  withLead: number;
  withoutLead: number;
  returning: { newVisitors: number; returningVisitors: number };
  timeToLeadHours: { avg: number | null; median: number | null };
  avgMessages: number;
  medianDurationHours: number | null;
  scatter: ScatterPoint[];
  heatmap: HeatmapCell[];
  insights: InsightChart[];
};

const FUNNEL_FIELDS = [
  "organization_type",
  "role",
  "main_problem",
  "client_dropoff_stage",
  "crm_status",
  "followup_method",
  "ai_automation_status",
  "monthly_inquiries",
  "primary_priority",
] as const;

const INSIGHT_FIELDS: Array<{ field: string; questionId: string | null }> = [
  { field: "organization_type", questionId: "q1" },
  { field: "role", questionId: "q2" },
  { field: "main_problem", questionId: "q3" },
  { field: "client_dropoff_stage", questionId: "q4" },
  { field: "crm_status", questionId: "q5" },
  { field: "followup_method", questionId: "q6" },
  { field: "ai_automation_status", questionId: "q7" },
  { field: "chatbot_issues", questionId: "q7a" },
  { field: "monthly_inquiries", questionId: "q8" },
  { field: "primary_priority", questionId: "q9" },
];

const DURATION_CAP_HOURS = 24;
const MS_DAY = 86_400_000;

export function parseAnalyticsRange(value: string | undefined): AnalyticsRange {
  if (value && ANALYTICS_RANGES.includes(value as AnalyticsRange)) {
    return value as AnalyticsRange;
  }
  return "30d";
}

export async function getAnalyticsDashboard(range: AnalyticsRange): Promise<AnalyticsDashboardData> {
  const now = new Date();
  const window = resolveWindow(range, now);
  const db = getDb();
  const messageFrom = window.previousFrom ?? window.from;

  const dayExpr = sql<string>`to_char(date_trunc('day', ${chatMessages.createdAt} AT TIME ZONE 'UTC'), 'YYYY-MM-DD')`;
  const dowExpr = sql<number>`extract(dow from ${chatMessages.createdAt} AT TIME ZONE 'UTC')`;
  const hourExpr = sql<number>`extract(hour from ${chatMessages.createdAt} AT TIME ZONE 'UTC')`;

  const dailySelect = () => db.select({ day: dayExpr, count: count() }).from(chatMessages);
  const heatmapSelect = () => db.select({ dow: dowExpr, hour: hourExpr, count: count() }).from(chatMessages);

  const [leadRows, sessionRows, messageCounts, dailyMessageRows, heatmapRows] = await Promise.all([
    db
      .select({
        id: leads.id,
        source: leads.source,
        status: leads.status,
        notifiedAt: leads.notifiedAt,
        createdAt: leads.createdAt,
        sessionId: leads.sessionId,
      })
      .from(leads),
    db
      .select({
        id: chatSessions.id,
        visitorId: chatSessions.visitorId,
        locale: chatSessions.locale,
        mode: chatSessions.mode,
        assessmentStep: chatSessions.assessmentStep,
        assessmentAnswers: chatSessions.assessmentAnswers,
        leadId: chatSessions.leadId,
        createdAt: chatSessions.createdAt,
        updatedAt: chatSessions.updatedAt,
      })
      .from(chatSessions),
    db
      .select({
        sessionId: chatMessages.sessionId,
        count: count(),
      })
      .from(chatMessages)
      .groupBy(chatMessages.sessionId),
    messageFrom
      ? dailySelect().where(gte(chatMessages.createdAt, messageFrom)).groupBy(dayExpr)
      : dailySelect().groupBy(dayExpr),
    window.from
      ? heatmapSelect().where(gte(chatMessages.createdAt, window.from)).groupBy(dowExpr, hourExpr)
      : heatmapSelect().groupBy(dowExpr, hourExpr),
  ]);

  const messagesBySession = new Map<string, number>();
  for (const row of messageCounts) {
    messagesBySession.set(row.sessionId, Number(row.count));
  }

  const messagesByDay = new Map<string, number>();
  for (const row of dailyMessageRows) {
    messagesByDay.set(String(row.day), Number(row.count));
  }

  const currentLeads = leadRows.filter((row) => inRange(row.createdAt, window.from, window.to));
  const previousLeads = window.previousFrom
    ? leadRows.filter((row) => inRange(row.createdAt, window.previousFrom, window.previousTo))
    : [];
  const currentSessions = sessionRows.filter((row) => inRange(row.createdAt, window.from, window.to));
  const previousSessions = window.previousFrom
    ? sessionRows.filter((row) => inRange(row.createdAt, window.previousFrom, window.previousTo))
    : [];

  const sessionById = new Map(sessionRows.map((row) => [row.id, row]));
  const visitorSessionCounts = new Map<string, number>();
  for (const row of sessionRows) {
    if (!row.visitorId) continue;
    visitorSessionCounts.set(row.visitorId, (visitorSessionCounts.get(row.visitorId) ?? 0) + 1);
  }

  const bucket = chooseBucket(window.from, window.to);
  const bucketKeys = enumerateBuckets(window.from, window.to, bucket, currentLeads, currentSessions);

  const currentMetrics = computeWindowMetrics(currentLeads, currentSessions);
  const previousMetrics = window.previousFrom
    ? computeWindowMetrics(previousLeads, previousSessions)
    : null;

  const kpis: KpiMetric[] = [
    metric("leads", currentMetrics.leads, previousMetrics?.leads, "number", "/admin/leads", sparklineCounts(
      currentLeads.map((row) => row.createdAt),
      bucketKeys,
      bucket,
    )),
    metric("visitors", currentMetrics.visitors, previousMetrics?.visitors, "number", "/admin/sessions", sparklineUnique(
      currentSessions.map((row) => ({ date: row.createdAt, id: row.visitorId })),
      bucketKeys,
      bucket,
    )),
    metric("sessions", currentMetrics.sessions, previousMetrics?.sessions, "number", "/admin/sessions", sparklineCounts(
      currentSessions.map((row) => row.createdAt),
      bucketKeys,
      bucket,
    )),
    metric(
      "assessmentsCompleted",
      currentMetrics.assessmentsCompleted,
      previousMetrics?.assessmentsCompleted,
      "number",
      "/admin/sessions",
      sparklineFlags(
        currentSessions.map((row) => ({ date: row.createdAt, flag: completedAssessment(row) })),
        bucketKeys,
        bucket,
      ),
    ),
    metric(
      "chatLeads",
      currentMetrics.chatLeads,
      previousMetrics?.chatLeads,
      "number",
      "/admin/leads?source=chat_assessment",
      sparklineFlags(
        currentLeads.map((row) => ({ date: row.createdAt, flag: row.source === "chat_assessment" })),
        bucketKeys,
        bucket,
      ),
    ),
    metric(
      "conversion",
      currentMetrics.conversion,
      previousMetrics?.conversion,
      "percent",
      "/admin/sessions?lead=linked",
      sparklineRatio(currentSessions, bucketKeys, bucket, startedAssessment, (row) => Boolean(row.leadId)),
    ),
    metric(
      "abandon",
      currentMetrics.abandon,
      previousMetrics?.abandon,
      "percent",
      "/admin/sessions?mode=lead_capture",
      sparklineRatio(currentSessions, bucketKeys, bucket, completedAssessment, (row) => completedAssessment(row) && !row.leadId),
      true,
    ),
    metric(
      "qualifiedClosed",
      currentMetrics.qualifiedClosed,
      previousMetrics?.qualifiedClosed,
      "number",
      "/admin/leads",
      sparklineFlags(
        currentLeads.map((row) => ({
          date: row.createdAt,
          flag: row.status === "qualified" || row.status === "closed",
        })),
        bucketKeys,
        bucket,
      ),
    ),
  ];

  const activity: TimePoint[] = bucketKeys.map((key) => ({
    date: key,
    leads: 0,
    sessions: 0,
    messages: 0,
  }));
  const activityIndex = new Map(activity.map((point, index) => [point.date, index]));
  for (const row of currentLeads) {
    const point = activity[activityIndex.get(bucketKey(row.createdAt, bucket)) ?? -1];
    if (point) point.leads += 1;
  }
  for (const row of currentSessions) {
    const point = activity[activityIndex.get(bucketKey(row.createdAt, bucket)) ?? -1];
    if (point) point.sessions += 1;
  }
  for (const [day, messageCount] of messagesByDay) {
    const key = bucket === "week" ? weekKeyFromDay(day) : day;
    const point = activity[activityIndex.get(key) ?? -1];
    if (point) point.messages += messageCount;
  }

  const dropoff: FunnelStep[] = FUNNEL_FIELDS.map((field) => ({
    key: field,
    count: currentSessions.filter((row) => hasAnswer(row.assessmentAnswers, field)).length,
  }));

  const funnel: FunnelStep[] = [
    { key: "sessions", count: currentSessions.length },
    { key: "started", count: currentSessions.filter(startedAssessment).length },
    { key: "completed", count: currentSessions.filter(completedAssessment).length },
    { key: "lead_submitted", count: currentSessions.filter((row) => Boolean(row.leadId)).length },
  ];

  const pipeline = LEAD_STATUSES.map((status) => ({
    key: status,
    count: currentLeads.filter((row) => row.status === status).length,
  }));

  const sources: NamedCount[] = [
    { key: "chat_assessment", count: currentLeads.filter((row) => row.source === "chat_assessment").length },
    { key: "contact_form", count: currentLeads.filter((row) => row.source === "contact_form").length },
  ];

  const modeCounts = new Map<string, number>();
  const localeCounts = new Map<string, number>();
  for (const row of currentSessions) {
    modeCounts.set(row.mode, (modeCounts.get(row.mode) ?? 0) + 1);
    localeCounts.set(row.locale || "en", (localeCounts.get(row.locale || "en") ?? 0) + 1);
  }
  const modes = [...modeCounts.entries()]
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({ key, count: value }));
  const locales = [...localeCounts.entries()].map(([key, value]) => ({ key, count: value }));

  const notified = currentLeads.filter((row) => Boolean(row.notifiedAt)).length;
  const withLead = currentSessions.filter((row) => Boolean(row.leadId)).length;
  const withoutLead = currentSessions.length - withLead;

  const visitorIds = new Set<string>();
  let returningVisitors = 0;
  for (const row of currentSessions) {
    if (!row.visitorId || visitorIds.has(row.visitorId)) continue;
    visitorIds.add(row.visitorId);
    if ((visitorSessionCounts.get(row.visitorId) ?? 0) > 1) returningVisitors += 1;
  }
  const newVisitors = visitorIds.size - returningVisitors;

  const convertHours: number[] = [];
  for (const lead of currentLeads) {
    if (!lead.sessionId) continue;
    const session = sessionById.get(lead.sessionId);
    if (!session) continue;
    const hours = hoursBetween(session.createdAt, lead.createdAt);
    if (hours >= 0 && hours <= 24 * 14) convertHours.push(hours);
  }

  const durationHours: number[] = [];
  const scatter: ScatterPoint[] = [];
  const messageTotals: number[] = [];
  for (const row of currentSessions) {
    const rawHours = hoursBetween(row.createdAt, row.updatedAt);
    const capped = Math.min(Math.max(rawHours, 0), DURATION_CAP_HOURS);
    durationHours.push(capped);
    const messages = messagesBySession.get(row.id) ?? 0;
    messageTotals.push(messages);
    scatter.push({
      messages,
      durationHours: Number(capped.toFixed(2)),
      converted: Boolean(row.leadId),
    });
  }

  const heatmapMap = new Map<string, number>();
  for (const row of heatmapRows) {
    heatmapMap.set(`${Number(row.dow)}-${Number(row.hour)}`, Number(row.count));
  }
  const heatmap: HeatmapCell[] = [];
  for (let dow = 0; dow < 7; dow += 1) {
    for (let hour = 0; hour < 24; hour += 1) {
      heatmap.push({ dow, hour, count: heatmapMap.get(`${dow}-${hour}`) ?? 0 });
    }
  }

  const insights: InsightChart[] = INSIGHT_FIELDS.map(({ field, questionId }) => ({
    field,
    questionId,
    buckets: histogram(currentSessions.map((row) => row.assessmentAnswers), field),
  })).filter((chart) => chart.buckets.length > 0);

  return {
    range,
    bucket,
    kpis,
    activity,
    funnel,
    dropoff,
    pipeline,
    sources,
    modes,
    locales,
    notifications: { notified, pending: currentLeads.length - notified },
    withLead,
    withoutLead,
    returning: { newVisitors, returningVisitors },
    timeToLeadHours: { avg: average(convertHours), median: median(convertHours) },
    avgMessages: average(messageTotals) ?? 0,
    medianDurationHours: median(durationHours),
    scatter,
    heatmap,
    insights,
  };
}

type LeadSlice = {
  source: "chat_assessment" | "contact_form";
  status: string;
  createdAt: Date;
};

type SessionSlice = {
  visitorId: string | null;
  mode: string;
  assessmentStep: string | null;
  assessmentAnswers: AssessmentAnswers;
  leadId: string | null;
  createdAt: Date;
};

function computeWindowMetrics(leadRows: LeadSlice[], sessionRows: SessionSlice[]) {
  const leadsCount = leadRows.length;
  const visitors = new Set(sessionRows.map((row) => row.visitorId).filter(Boolean)).size;
  const sessionsCount = sessionRows.length;
  const started = sessionRows.filter(startedAssessment).length;
  const assessmentsCompleted = sessionRows.filter(completedAssessment).length;
  const chatLeads = leadRows.filter((row) => row.source === "chat_assessment").length;
  const converted = sessionRows.filter((row) => Boolean(row.leadId)).length;
  const abandoned = sessionRows.filter((row) => completedAssessment(row) && !row.leadId).length;
  const qualifiedClosed = leadRows.filter(
    (row) => row.status === "qualified" || row.status === "closed",
  ).length;

  return {
    leads: leadsCount,
    visitors,
    sessions: sessionsCount,
    assessmentsCompleted,
    chatLeads,
    conversion: started > 0 ? converted / started : 0,
    abandon: assessmentsCompleted > 0 ? abandoned / assessmentsCompleted : 0,
    qualifiedClosed,
  };
}

function metric(
  key: KpiKey,
  value: number,
  previous: number | undefined,
  format: KpiMetric["format"],
  href: string,
  sparkline: number[],
  invertDelta = false,
): KpiMetric {
  return {
    key,
    value,
    previous: previous ?? null,
    deltaPct: previous == null ? null : percentChange(value, previous),
    format,
    invertDelta: invertDelta || undefined,
    href,
    sparkline,
  };
}

function startedAssessment(session: Pick<SessionSlice, "assessmentAnswers" | "assessmentStep">) {
  return Object.keys(session.assessmentAnswers ?? {}).length > 0 || Boolean(session.assessmentStep);
}

function completedAssessment(session: Pick<SessionSlice, "assessmentAnswers" | "mode">) {
  return (
    hasAnswer(session.assessmentAnswers, "primary_priority") ||
    session.mode === "lead_capture" ||
    session.mode === "done"
  );
}

function hasAnswer(answers: AssessmentAnswers | null | undefined, field: string) {
  const entry = answers?.[field];
  if (!entry) return false;
  if (Array.isArray(entry.value)) return entry.value.length > 0;
  return String(entry.value ?? "").trim().length > 0;
}

function answerValues(answers: AssessmentAnswers | null | undefined, field: string): string[] {
  const entry = answers?.[field];
  if (!entry) return [];
  const raw = Array.isArray(entry.value) ? entry.value : [entry.value];
  return raw
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .map((value) => (value === "custom" ? "other" : value));
}

function histogram(answerSets: AssessmentAnswers[], field: string): Array<{ value: string; count: number }> {
  const counts = new Map<string, number>();
  for (const answers of answerSets) {
    const unique = new Set(answerValues(answers, field));
    for (const value of unique) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function resolveWindow(range: AnalyticsRange, now: Date) {
  if (range === "all") {
    return { from: null as Date | null, to: now, previousFrom: null as Date | null, previousTo: null as Date | null };
  }
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const from = new Date(now.getTime() - days * MS_DAY);
  const previousFrom = new Date(from.getTime() - days * MS_DAY);
  return { from, to: now, previousFrom, previousTo: from };
}

function inRange(date: Date, from: Date | null, to: Date | null) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function chooseBucket(from: Date | null, to: Date): "day" | "week" {
  const start = from ?? new Date(to.getTime() - 90 * MS_DAY);
  const days = Math.max(1, Math.ceil((to.getTime() - start.getTime()) / MS_DAY));
  return days > 60 ? "week" : "day";
}

function enumerateBuckets(
  from: Date | null,
  to: Date,
  bucket: "day" | "week",
  leadRows: Array<{ createdAt: Date }>,
  sessionRows: Array<{ createdAt: Date }>,
) {
  let start = from;
  if (!start) {
    const dates = [...leadRows, ...sessionRows].map((row) => row.createdAt);
    start = dates.length ? new Date(Math.min(...dates.map((date) => date.getTime()))) : new Date(to.getTime() - 30 * MS_DAY);
  }
  const keys: string[] = [];
  if (bucket === "day") {
    const cursor = startOfUtcDay(start);
    const end = startOfUtcDay(to);
    while (cursor <= end) {
      keys.push(dayKey(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return keys;
  }
  const cursor = startOfUtcWeek(start);
  const end = startOfUtcWeek(to);
  while (cursor <= end) {
    keys.push(dayKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 7);
  }
  return keys;
}

function sparklineCounts(dates: Date[], keys: string[], bucket: "day" | "week") {
  const map = zeroMap(keys);
  for (const date of dates) {
    const key = bucketKey(date, bucket);
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
  }
  return keys.map((key) => map.get(key) ?? 0);
}

function sparklineUnique(
  rows: Array<{ date: Date; id: string | null }>,
  keys: string[],
  bucket: "day" | "week",
) {
  const sets = new Map<string, Set<string>>();
  for (const key of keys) sets.set(key, new Set());
  for (const row of rows) {
    if (!row.id) continue;
    sets.get(bucketKey(row.date, bucket))?.add(row.id);
  }
  return keys.map((key) => sets.get(key)?.size ?? 0);
}

function sparklineFlags(
  rows: Array<{ date: Date; flag: boolean }>,
  keys: string[],
  bucket: "day" | "week",
) {
  const map = zeroMap(keys);
  for (const row of rows) {
    if (!row.flag) continue;
    const key = bucketKey(row.date, bucket);
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
  }
  return keys.map((key) => map.get(key) ?? 0);
}

function sparklineRatio(
  sessions: SessionSlice[],
  keys: string[],
  bucket: "day" | "week",
  denominator: (row: SessionSlice) => boolean,
  numerator: (row: SessionSlice) => boolean,
) {
  const den = zeroMap(keys);
  const num = zeroMap(keys);
  for (const row of sessions) {
    const key = bucketKey(row.createdAt, bucket);
    if (!den.has(key)) continue;
    if (denominator(row)) den.set(key, (den.get(key) ?? 0) + 1);
    if (numerator(row)) num.set(key, (num.get(key) ?? 0) + 1);
  }
  return keys.map((key) => {
    const d = den.get(key) ?? 0;
    return d > 0 ? (num.get(key) ?? 0) / d : 0;
  });
}

function zeroMap(keys: string[]) {
  return new Map(keys.map((key) => [key, 0]));
}

function bucketKey(date: Date, bucket: "day" | "week") {
  return bucket === "week" ? dayKey(startOfUtcWeek(date)) : dayKey(startOfUtcDay(date));
}

function weekKeyFromDay(day: string) {
  return dayKey(startOfUtcWeek(new Date(`${day}T00:00:00.000Z`)));
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function startOfUtcWeek(date: Date) {
  const day = startOfUtcDay(date);
  const dow = day.getUTCDay();
  const offset = dow === 0 ? 6 : dow - 1;
  day.setUTCDate(day.getUTCDate() - offset);
  return day;
}

function hoursBetween(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / 3_600_000;
}

function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}
