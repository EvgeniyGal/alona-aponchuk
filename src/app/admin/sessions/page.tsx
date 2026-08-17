import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { CHAT_MODES } from "@/lib/admin/chat-session";
import { SessionsTable, type SessionRow } from "@/components/admin/sessions-table";
import { getDb } from "@/lib/db";
import { chatMessages, chatSessions, leads } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string; mode?: string }>;
}) {
  await requireAdmin();
  const t = await getTranslations("admin");
  const params = await searchParams;
  const db = getDb();

  const rows = await db
    .select({
      id: chatSessions.id,
      visitorId: chatSessions.visitorId,
      mode: chatSessions.mode,
      leadId: chatSessions.leadId,
      createdAt: chatSessions.createdAt,
      updatedAt: chatSessions.updatedAt,
      messageCount: count(chatMessages.id),
      leadName: leads.fullName,
      leadEmail: leads.workEmail,
    })
    .from(chatSessions)
    .leftJoin(chatMessages, eq(chatMessages.sessionId, chatSessions.id))
    .leftJoin(leads, eq(leads.id, chatSessions.leadId))
    .groupBy(
      chatSessions.id,
      chatSessions.visitorId,
      chatSessions.mode,
      chatSessions.leadId,
      chatSessions.createdAt,
      chatSessions.updatedAt,
      leads.fullName,
      leads.workEmail,
    )
    .orderBy(desc(chatSessions.updatedAt));

  const filtered = rows.filter((row) => {
    if (params.lead === "linked" && !row.leadId) return false;
    if (params.lead === "none" && row.leadId) return false;
    if (params.mode && row.mode !== params.mode) return false;
    return true;
  });

  const tableData: SessionRow[] = filtered.map((row) => ({
    id: row.id,
    visitorId: row.visitorId,
    mode: row.mode,
    messageCount: Number(row.messageCount),
    leadId: row.leadId,
    leadName: row.leadName,
    leadEmail: row.leadEmail,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{t("sessions.title")}</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">{t("sessions.lead")}</p>
        </div>
        <p className="text-[13px] text-muted-foreground">
          {filtered.length === 1
            ? t("sessions.count", { count: filtered.length })
            : t("sessions.countPlural", { count: filtered.length })}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-[13px]">
        <Link
          href="/admin/sessions"
          className={cn(
            "rounded-full border px-3 py-1 hover:border-blue",
            !params.lead ? "border-blue bg-blue-soft/50 text-blue" : "border-hairline",
          )}
        >
          {t("sessions.all")}
        </Link>
        <Link
          href="/admin/sessions?lead=linked"
          className={cn(
            "rounded-full border px-3 py-1 hover:border-blue",
            params.lead === "linked" ? "border-blue bg-blue-soft/50 text-blue" : "border-hairline",
          )}
        >
          {t("sessions.withLead")}
        </Link>
        <Link
          href="/admin/sessions?lead=none"
          className={cn(
            "rounded-full border px-3 py-1 hover:border-blue",
            params.lead === "none" ? "border-blue bg-blue-soft/50 text-blue" : "border-hairline",
          )}
        >
          {t("sessions.noLead")}
        </Link>
        {CHAT_MODES.map((mode) => (
          <Link
            key={mode}
            href={`/admin/sessions?mode=${mode}${params.lead ? `&lead=${params.lead}` : ""}`}
            className={cn(
              "rounded-full border px-3 py-1 hover:border-blue",
              params.mode === mode ? "border-blue bg-blue-soft/50 text-blue" : "border-hairline",
            )}
          >
            {t(`sessions.modes.${mode}`)}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <SessionsTable key={`${params.lead ?? "all"}-${params.mode ?? "all"}`} data={tableData} />
      </div>
    </div>
  );
}
