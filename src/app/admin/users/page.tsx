import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { setUserApproved } from "./actions";
import { InviteUserForm } from "./invite-form";

export default async function UsersPage() {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div>
      <h1 className="font-display text-3xl">Users</h1>
      <p className="mt-2 text-[14px] text-muted-foreground">Invite-only admin access. Revoking approval blocks login and Telegram alerts.</p>
      <InviteUserForm />
      <div className="mt-8 overflow-x-auto rounded-xl border border-hairline bg-white">
        <table className="w-full min-w-[640px] text-left text-[13.5px]">
          <thead className="border-b border-hairline bg-ivory/80 text-[12px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Approved</th>
              <th className="px-4 py-3">Telegram</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.id} className="border-b border-hairline last:border-0">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.name || "—"}</td>
                <td className="px-4 py-3">{user.approved ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{user.telegramUsername ? `@${user.telegramUsername}` : user.telegramChatId ? "Linked" : "Not linked"}</td>
                <td className="px-4 py-3">
                  <form action={setUserApproved}>
                    <input type="hidden" name="id" value={user.id} />
                    <input type="hidden" name="approved" value={user.approved ? "false" : "true"} />
                    <button type="submit" className="text-blue hover:underline">
                      {user.approved ? "Revoke" : "Restore"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
