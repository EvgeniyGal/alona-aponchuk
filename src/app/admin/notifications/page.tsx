import { requireAdmin } from "@/lib/admin/require-admin";
import { TelegramConnect } from "./telegram-connect";

export default async function NotificationsPage() {
  const user = await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-3xl">Notifications</h1>
      <p className="mt-2 max-w-2xl text-[14px] text-muted-foreground">
        Lead emails go to info@aponchukworkflow.com. Telegram alerts include a short summary and a link to the lead
        profile. Full transcripts stay in the admin panel.
      </p>
      <TelegramConnect linked={Boolean(user.telegramChatId)} username={user.telegramUsername} />
    </div>
  );
}
