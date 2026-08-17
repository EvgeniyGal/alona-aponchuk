import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { assistantSettings } from "@/lib/db/schema";
import { saveAssistantSettings } from "./actions";

const fieldCls =
  "w-full rounded-md border border-hairline bg-white px-3 py-2.5 text-[14px] outline-none focus:border-blue";

const promptFields = [
  "systemPrompt",
  "faqPrompt",
  "diagnosticPrompt",
  "fallbackUnknown",
  "fallbackMedical",
  "fallbackPhi",
  "fallbackGuarantee",
] as const;

export default async function SettingsPage() {
  await requireAdmin();
  const t = await getTranslations("admin");
  const db = getDb();
  const [settings] = await db.select().from(assistantSettings).where(eq(assistantSettings.id, "default")).limit(1);

  return (
    <div>
      <h1 className="font-display text-3xl">{t("settings.title")}</h1>
      <p className="mt-2 text-[14px] text-muted-foreground">{t("settings.lead")}</p>
      <form action={saveAssistantSettings} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">{t("settings.model")}</span>
            <input className={fieldCls} name="openaiModel" defaultValue={settings?.openaiModel ?? "gpt-4o-mini"} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">{t("settings.temperature")}</span>
            <input
              className={fieldCls}
              name="temperature"
              type="number"
              min="0"
              max="1"
              step="0.1"
              defaultValue={settings?.temperature ?? 0.3}
            />
          </label>
        </div>
        {promptFields.map((name) => (
          <label key={name} className="block">
            <span className="mb-1.5 block text-[13px] font-medium">{t(`settings.${name}`)}</span>
            <textarea className={fieldCls} name={name} rows={name === "systemPrompt" ? 10 : 4} defaultValue={String(settings?.[name] ?? "")} />
          </label>
        ))}
        <button type="submit" className="rounded-md bg-blue px-4 py-2.5 text-[14px] font-medium text-white">
          {t("settings.save")}
        </button>
      </form>
    </div>
  );
}
