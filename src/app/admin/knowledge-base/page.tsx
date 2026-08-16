import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { knowledgeBaseEntries } from "@/lib/db/schema";
import { createKbEntry, deleteKbEntry, updateKbEntry } from "./actions";

const inputCls =
  "w-full rounded-md border border-hairline bg-white px-3 py-2 text-[14px] outline-none focus:border-blue";

export default async function KnowledgeBasePage() {
  await requireAdmin();
  const db = getDb();
  const entries = await db.select().from(knowledgeBaseEntries).orderBy(asc(knowledgeBaseEntries.sortOrder));

  return (
    <div>
      <h1 className="font-display text-3xl">Knowledge base</h1>
      <p className="mt-2 text-[14px] text-muted-foreground">
        Approved answers used by the assistant. Inactive entries are excluded from the cached prompt.
      </p>

      <form action={createKbEntry} className="mt-8 space-y-3 rounded-xl border border-hairline bg-white p-5">
        <h2 className="font-display text-lg">Add entry</h2>
        <input className={inputCls} name="slug" placeholder="slug-for-analytics" required />
        <input className={inputCls} name="intent" placeholder="User question / intent" required />
        <textarea className={inputCls} name="approvedAnswer" rows={4} placeholder="Approved answer" required />
        <button type="submit" className="rounded-md bg-blue px-4 py-2 text-[13.5px] font-medium text-white">
          Add
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {entries.map((entry) => (
          <form key={entry.id} action={updateKbEntry} className="space-y-3 rounded-xl border border-hairline bg-white p-5">
            <input type="hidden" name="id" value={entry.id} />
            <p className="text-[12px] text-muted-foreground">{entry.slug}</p>
            <input className={inputCls} name="intent" defaultValue={entry.intent} />
            <textarea className={inputCls} name="approvedAnswer" rows={4} defaultValue={entry.approvedAnswer} />
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" name="active" defaultChecked={entry.active} />
              Active
            </label>
            <div className="flex gap-2">
              <button type="submit" className="rounded-md bg-blue px-3 py-2 text-[13px] font-medium text-white">
                Save
              </button>
              <button formAction={deleteKbEntry} className="rounded-md border border-hairline px-3 py-2 text-[13px]">
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
