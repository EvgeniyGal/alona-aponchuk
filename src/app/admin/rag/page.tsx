import { desc } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { ragDocuments } from "@/lib/db/schema";
import { RagConsole } from "./rag-console";

export default async function RagPage() {
  await requireAdmin();
  const t = await getTranslations("admin.rag");
  const db = getDb();
  const documents = await db.select().from(ragDocuments).orderBy(desc(ragDocuments.createdAt));

  return (
    <div>
      <h1 className="font-display text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-[14px] text-muted-foreground">{t("lead")}</p>
      <RagConsole initialDocuments={documents} />
    </div>
  );
}
