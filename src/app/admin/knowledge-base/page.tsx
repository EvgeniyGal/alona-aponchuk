import { asc } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { knowledgeBaseEntries } from "@/lib/db/schema";
import { KnowledgeBaseTable, type KbRow } from "@/components/admin/kb-table";
import { createKbEntry } from "./actions";

const inputCls =
  "w-full rounded-md border border-hairline bg-white px-3 py-2 text-[14px] outline-none focus:border-blue";

export default async function KnowledgeBasePage() {
  await requireAdmin();
  const t = await getTranslations("admin");
  const db = getDb();
  const entries = await db.select().from(knowledgeBaseEntries).orderBy(asc(knowledgeBaseEntries.sortOrder));

  const tableData: KbRow[] = entries.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    intent: entry.intent,
    approvedAnswer: entry.approvedAnswer,
    active: entry.active,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="font-display text-3xl">{t("kb.title")}</h1>
      <p className="mt-2 text-[14px] text-muted-foreground">{t("kb.lead")}</p>

      <form action={createKbEntry} className="mt-8 space-y-3 rounded-xl border border-hairline bg-white p-5">
        <h2 className="font-display text-lg">{t("kb.add")}</h2>
        <input className={inputCls} name="slug" placeholder={t("kb.slug")} required />
        <input className={inputCls} name="intent" placeholder={t("kb.intent")} required />
        <textarea className={inputCls} name="approvedAnswer" rows={4} placeholder={t("kb.answer")} required />
        <button type="submit" className="rounded-md bg-blue px-4 py-2 text-[13.5px] font-medium text-white">
          {t("kb.add")}
        </button>
      </form>

      <div className="mt-8">
        <KnowledgeBaseTable data={tableData} />
      </div>
    </div>
  );
}
