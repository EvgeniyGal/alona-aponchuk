import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { assistantSettings } from "@/lib/db/schema";
import { saveAssistantSettings } from "./actions";

const fieldCls =
  "w-full rounded-md border border-hairline bg-white px-3 py-2.5 text-[14px] outline-none focus:border-blue";

export default async function SettingsPage() {
  await requireAdmin();
  const db = getDb();
  const [settings] = await db.select().from(assistantSettings).where(eq(assistantSettings.id, "default")).limit(1);

  return (
    <div>
      <h1 className="font-display text-3xl">Assistant settings</h1>
      <p className="mt-2 text-[14px] text-muted-foreground">
        Model, prompts, and fallbacks. Saving refreshes the cached assistant config.
      </p>
      <form action={saveAssistantSettings} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">OpenAI model</span>
            <input className={fieldCls} name="openaiModel" defaultValue={settings?.openaiModel ?? "gpt-4o-mini"} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Temperature</span>
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
        {[
          ["systemPrompt", "System prompt", settings?.systemPrompt],
          ["faqPrompt", "FAQ prompt", settings?.faqPrompt],
          ["diagnosticPrompt", "Diagnostic prompt", settings?.diagnosticPrompt],
          ["fallbackUnknown", "Unknown fallback", settings?.fallbackUnknown],
          ["fallbackMedical", "Medical fallback", settings?.fallbackMedical],
          ["fallbackPhi", "PHI fallback", settings?.fallbackPhi],
          ["fallbackGuarantee", "Guarantee fallback", settings?.fallbackGuarantee],
        ].map(([name, label, value]) => (
          <label key={String(name)} className="block">
            <span className="mb-1.5 block text-[13px] font-medium">{label}</span>
            <textarea className={fieldCls} name={String(name)} rows={name === "systemPrompt" ? 10 : 4} defaultValue={String(value ?? "")} />
          </label>
        ))}
        <button type="submit" className="rounded-md bg-blue px-4 py-2.5 text-[14px] font-medium text-white">
          Save settings
        </button>
      </form>
    </div>
  );
}
