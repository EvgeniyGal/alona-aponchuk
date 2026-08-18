import { desc } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { UserApprovalButton } from "./approval-button";
import { DeleteUserButton } from "./delete-user-button";
import { InviteUserForm } from "./invite-form";
import { adminTableHeadClass } from "@/lib/utils";

export default async function UsersPage() {
  const currentUser = await requireAdmin();
  const t = await getTranslations("admin");
  const common = await getTranslations("common");
  const db = getDb();
  const rows = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div>
      <h1 className="font-display text-3xl">{t("users.title")}</h1>
      <p className="mt-2 text-[14px] text-muted-foreground">{t("users.lead")}</p>
      <InviteUserForm />
      <div className="mt-8 overflow-x-auto rounded-xl border border-hairline bg-white">
        <table className="w-full min-w-[640px] text-left text-[13.5px]">
          <thead className={adminTableHeadClass}>
            <tr>
              <th className="px-4 py-3">{t("users.email")}</th>
              <th className="px-4 py-3">{t("users.name")}</th>
              <th className="px-4 py-3">{t("users.approved")}</th>
              <th className="px-4 py-3">{t("users.telegram")}</th>
              <th className="px-4 py-3">{t("users.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.id} className="border-b border-hairline last:border-0">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.name || "—"}</td>
                <td className="px-4 py-3">{user.approved ? common("yes") : common("no")}</td>
                <td className="px-4 py-3">{user.telegramUsername ? `@${user.telegramUsername}` : user.telegramChatId ? t("users.linked") : t("users.notLinked")}</td>
                <td className="px-4 py-3">
                  {user.id === currentUser.id ? (
                    <span className="text-[12px] text-muted-foreground">{common("you")}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserApprovalButton userId={user.id} approved={user.approved} />
                      <DeleteUserButton userId={user.id} userName={user.name || user.email} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
