"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTelegramLink,
  disconnectTelegram,
  fetchTelegramWebhookStatus,
  getTelegramLinkStatus,
} from "./actions";
import type { TelegramWebhookStatus } from "@/lib/notify/telegram";

export function TelegramConnect({
  linked: initialLinked,
  username: initialUsername,
  webhookStatus: initialWebhookStatus,
}: {
  linked: boolean;
  username: string | null;
  webhookStatus: TelegramWebhookStatus;
}) {
  const router = useRouter();
  const [linked, setLinked] = useState(initialLinked);
  const [username, setUsername] = useState(initialUsername);
  const [webhookStatus, setWebhookStatus] = useState(initialWebhookStatus);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [waitingForLink, setWaitingForLink] = useState(false);

  useEffect(() => {
    setLinked(initialLinked);
    setUsername(initialUsername);
    setWebhookStatus(initialWebhookStatus);
  }, [initialLinked, initialUsername, initialWebhookStatus]);

  useEffect(() => {
    if (!waitingForLink || linked) return;

    const interval = window.setInterval(async () => {
      const status = await getTelegramLinkStatus();
      if (status.linked) {
        setLinked(true);
        setUsername(status.username);
        setWaitingForLink(false);
        setUrl(null);
        router.refresh();
      }
    }, 2000);

    return () => window.clearInterval(interval);
  }, [waitingForLink, linked, router]);

  const webhookHealthy =
    webhookStatus.configured && webhookStatus.urlMatches && !webhookStatus.lastError;

  return (
    <div className="mt-6 space-y-4 rounded-xl border border-hairline bg-white p-6">
      <p className="text-[14px]">
        Status:{" "}
        {linked ? (
          <span className="font-medium text-blue">Linked{username ? ` as @${username}` : ""}</span>
        ) : (
          <span className="text-muted-foreground">Not linked</span>
        )}
      </p>

      {!webhookHealthy ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-3 text-[13px] text-destructive">
          <p className="font-medium">Telegram webhook is not healthy, so connect links will not work yet.</p>
          {webhookStatus.lastError ? <p className="mt-1">Error: {webhookStatus.lastError}</p> : null}
          <p className="mt-1 text-graphite/80">
            Expected webhook URL: <span className="font-mono text-[12px]">{webhookStatus.expectedUrl}</span>
          </p>
          {webhookStatus.url && webhookStatus.url !== webhookStatus.expectedUrl ? (
            <p className="mt-1 text-graphite/80">
              Current webhook URL: <span className="font-mono text-[12px]">{webhookStatus.url}</span>
            </p>
          ) : null}
          {webhookStatus.pendingUpdates > 0 ? (
            <p className="mt-1 text-graphite/80">{webhookStatus.pendingUpdates} pending Telegram updates.</p>
          ) : null}
          <p className="mt-2 text-graphite/80">
            After deploying the site, run <span className="font-mono text-[12px]">npm run telegram:set-webhook</span>{" "}
            with <span className="font-mono text-[12px]">NEXT_PUBLIC_SITE_URL=https://aponchukworkflow.com</span>.
          </p>
        </div>
      ) : null}

      <p className="text-[13.5px] text-muted-foreground">
        Only approved admins who connect Telegram here receive lead summaries. Unregistered Telegram accounts cannot
        subscribe by messaging the bot.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy || !webhookHealthy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              const link = await createTelegramLink();
              setUrl(link);
              setWaitingForLink(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not create link.");
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-md bg-blue px-4 py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
        >
          {linked ? "Reconnect Telegram" : "Connect Telegram"}
        </button>
        {linked ? (
          <form action={disconnectTelegram}>
            <button type="submit" className="rounded-md border border-hairline px-4 py-2.5 text-[14px]">
              Disconnect
            </button>
          </form>
        ) : null}
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const status = await fetchTelegramWebhookStatus();
              setWebhookStatus(status);
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-md border border-hairline px-4 py-2.5 text-[14px]"
        >
          Refresh webhook status
        </button>
      </div>
      {url ? (
        <div className="space-y-2 text-[14px]">
          <p>
            Open this link in Telegram within 10 minutes:{" "}
            <a href={url} className="break-all text-blue hover:underline" target="_blank" rel="noreferrer">
              {url}
            </a>
          </p>
          {waitingForLink && !linked ? (
            <p className="text-[13px] text-muted-foreground">
              Waiting for Telegram to confirm the link… Press Start in the bot if prompted.
            </p>
          ) : null}
        </div>
      ) : null}
      {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
    </div>
  );
}
