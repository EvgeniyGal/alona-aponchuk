import { requireAdmin } from "@/lib/admin/require-admin";
import { getLeadNotificationEmails } from "@/lib/notify/settings";
import { listTelegramRecipientViews } from "@/lib/notify/telegram-recipients";
import { getTelegramWebhookStatus } from "@/lib/notify/telegram";
import { LeadEmailsForm } from "./lead-email-form";
import { TelegramConnect } from "./telegram-connect";

export default async function NotificationsPage() {
  const user = await requireAdmin();
  const [leadEmails, webhookStatus, recipients] = await Promise.all([
    getLeadNotificationEmails(),
    getTelegramWebhookStatus(),
    listTelegramRecipientViews(user.id),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl">Notifications</h1>
      <p className="mt-2 max-w-2xl text-[14px] text-muted-foreground">
        Configure where new lead emails and Telegram alerts are delivered. Telegram alerts include a short summary and a
        link to the lead profile. Full transcripts stay in the admin panel.
      </p>

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
