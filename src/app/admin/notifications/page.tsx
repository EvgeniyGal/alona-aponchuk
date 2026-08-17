import { getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getLeadNotificationEmails } from "@/lib/notify/settings";
import { listTelegramRecipientViews } from "@/lib/notify/telegram-recipients";
import { getTelegramWebhookStatus } from "@/lib/notify/telegram";
import { LeadEmailsForm } from "./lead-email-form";
import { TelegramConnect } from "./telegram-connect";

export default async function NotificationsPage() {
  const user = await requireAdmin();
  const t = await getTranslations("admin");
  const [leadEmails, webhookStatus, recipients] = await Promise.all([
    getLeadNotificationEmails(),
    getTelegramWebhookStatus(),
    listTelegramRecipientViews(user.id),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl">{t("notifications.title")}</h1>
      <p className="mt-2 max-w-2xl text-[14px] text-muted-foreground">{t("notifications.lead")}</p>

      <LeadEmailsForm initialEmails={leadEmails} />

      <div className="mt-8">
        <TelegramConnect
          linked={Boolean(user.telegramChatId)}
          username={user.telegramUsername}
          linkedAt={user.telegramLinkedAt?.toISOString() ?? null}
          recipients={recipients}
          webhookStatus={webhookStatus}
        />
      </div>
    </div>
  );
}
