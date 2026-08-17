import { and, eq, isNotNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getExtraTelegramRecipients } from "@/lib/notify/settings";

export type TelegramRecipientView = {
  key: string;
  telegramUserId: string;
  telegramUsername: string | null;
  linkedAt: string | null;
  source: "admin" | "extra";
  adminEmail: string | null;
  adminName: string | null;
  isCurrentUser: boolean;
};

export async function listTelegramRecipientViews(currentUserId: string): Promise<TelegramRecipientView[]> {
  const db = getDb();
  const [admins, extras] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        telegramUserId: users.telegramUserId,
        telegramUsername: users.telegramUsername,
        telegramLinkedAt: users.telegramLinkedAt,
      })
      .from(users)
      .where(and(eq(users.approved, true), isNotNull(users.telegramChatId))),
    getExtraTelegramRecipients(),
  ]);

  const adminViews: TelegramRecipientView[] = admins.flatMap((admin) => {
    if (!admin.telegramUserId) return [];
    return [
      {
        key: `admin:${admin.id}`,
        telegramUserId: admin.telegramUserId,
        telegramUsername: admin.telegramUsername,
        linkedAt: admin.telegramLinkedAt?.toISOString() ?? null,
        source: "admin" as const,
        adminEmail: admin.email,
        adminName: admin.name,
        isCurrentUser: admin.id === currentUserId,
      },
    ];
  });

  const extraViews: TelegramRecipientView[] = extras
    .filter((item) => !adminViews.some((admin) => admin.telegramUserId === item.telegramUserId))
    .map((item) => ({
      key: `extra:${item.telegramUserId}`,
      telegramUserId: item.telegramUserId,
      telegramUsername: item.telegramUsername,
      linkedAt: item.linkedAt,
      source: "extra" as const,
      adminEmail: null,
      adminName: null,
      isCurrentUser: false,
    }));

  return [...adminViews, ...extraViews].sort((a, b) => {
    const aTime = a.linkedAt ? new Date(a.linkedAt).getTime() : 0;
    const bTime = b.linkedAt ? new Date(b.linkedAt).getTime() : 0;
    return bTime - aTime;
  });
}
