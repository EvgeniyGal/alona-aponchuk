"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import {
  createTelegramLink,
  createTelegramRecipientLink,
  disconnectTelegramRecipient,
  fetchTelegramWebhookStatus,
  getTelegramLinkStatus,
  sendTestTelegramAlert,
} from "./actions";
import { formatAdminDateTime } from "@/lib/admin/format-date";
import { adminTableHeadClass } from "@/lib/utils";
import type { TelegramWebhookStatus } from "@/lib/notify/telegram";
import type { TelegramRecipientView } from "@/lib/notify/telegram-recipients";

export function TelegramConnect({
  linked: initialLinked,
  username: initialUsername,
  linkedAt: initialLinkedAt,
  recipients: initialRecipients,
  webhookStatus: initialWebhookStatus,
}: {
  linked: boolean;
  username: string | null;
  linkedAt: string | null;
  recipients: TelegramRecipientView[];
  webhookStatus: TelegramWebhookStatus;
}) {
  const t = useTranslations("admin");
  const common = useTranslations("common");
  const router = useRouter();
  const [linked, setLinked] = useState(initialLinked);
  const [username, setUsername] = useState(initialUsername);
  const [linkedAt, setLinkedAt] = useState(initialLinkedAt);
  const [recipients, setRecipients] = useState(initialRecipients);
  const [webhookStatus, setWebhookStatus] = useState(initialWebhookStatus);
  const [url, setUrl] = useState<string | null>(null);
  const [linkKind, setLinkKind] = useState<"self" | "extra" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [waitingForLink, setWaitingForLink] = useState(false);
  const [removeKey, setRemoveKey] = useState<string | null>(null);
  const [expectedCount, setExpectedCount] = useState(initialRecipients.length);
  const previousLinkedAt = useRef(initialLinkedAt);

  useEffect(() => {
    setLinked(initialLinked);
    setUsername(initialUsername);
    setLinkedAt(initialLinkedAt);
    setRecipients(initialRecipients);
    setWebhookStatus(initialWebhookStatus);
  }, [initialLinked, initialUsername, initialLinkedAt, initialRecipients, initialWebhookStatus]);

  useEffect(() => {
    if (!waitingForLink) return;

    const interval = window.setInterval(async () => {
      const status = await getTelegramLinkStatus();
      setLinked(status.linked);
      setUsername(status.username);
      setLinkedAt(status.linkedAt);
      setRecipients(status.recipients);
      if (
        (linkKind === "self" && status.linked && status.linkedAt !== previousLinkedAt.current) ||
        (linkKind === "extra" && status.recipients.length >= expectedCount)
      ) {
        setWaitingForLink(false);
        setUrl(null);
        setLinkKind(null);
        router.refresh();
      }
    }, 2000);

    return () => window.clearInterval(interval);
  }, [waitingForLink, linkKind, expectedCount, router]);

  const webhookHealthy =
    webhookStatus.configured && webhookStatus.urlMatches && (webhookStatus.liveOk || !webhookStatus.lastError);

  const toRemove = recipients.find((item) => item.key === removeKey);

  return (
    <div className="mt-6 space-y-4 rounded-xl border border-hairline bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg">{t("notifications.telegramTitle")}</h2>
          <p className="mt-1 text-[13.5px] text-muted-foreground">{t("notifications.telegramLead")}</p>
        </div>
        <button
          type="button"
          disabled={busy || !webhookHealthy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            setMessage(null);
            try {
              const link = await createTelegramRecipientLink();
              setExpectedCount(recipients.length + 1);
              setUrl(link);
              setLinkKind("extra");
              setWaitingForLink(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : t("notifications.createLinkError"));
            } finally {
              setBusy(false);
            }
          }}
          className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-blue hover:underline disabled:opacity-60"
        >
          <Plus size={14} />
          {t("notifications.addTelegram")}
        </button>
      </div>

      {!webhookHealthy ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-3 text-[13px] text-destructive">
          <p className="font-medium">{t("notifications.webhookUnhealthy")}</p>
          {webhookStatus.lastError ? <p className="mt-1">{t("notifications.webhookError", { error: webhookStatus.lastError })}</p> : null}
          <p className="mt-1 text-graphite/80">
            {t("notifications.expectedUrl")} <span className="font-mono text-[12px]">{webhookStatus.expectedUrl}</span>
          </p>
          {webhookStatus.url && webhookStatus.url !== webhookStatus.expectedUrl ? (
            <p className="mt-1 text-graphite/80">
              {t("notifications.currentUrl")} <span className="font-mono text-[12px]">{webhookStatus.url}</span>
            </p>
          ) : null}
          {webhookStatus.pendingUpdates > 0 ? (
            <p className="mt-1 text-graphite/80">{t("notifications.pendingUpdates", { count: webhookStatus.pendingUpdates })}</p>
          ) : null}
          <p className="mt-2 text-graphite/80">{t("notifications.webhookHint")}</p>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-hairline">
        <table className="w-full min-w-[640px] text-left text-[13.5px]">
          <thead className={adminTableHeadClass}>
            <tr>
              <th className="px-4 py-3">{t("notifications.colTelegram")}</th>
              <th className="px-4 py-3">{t("notifications.colConnectedAs")}</th>
              <th className="px-4 py-3">{t("notifications.colLinked")}</th>
              <th className="px-4 py-3">{t("notifications.colType")}</th>
              <th className="px-4 py-3">{t("notifications.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {recipients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-muted-foreground">
                  {t("notifications.emptyTelegram")}
                </td>
              </tr>
            ) : (
              recipients.map((recipient) => (
                <tr key={recipient.key} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3 font-medium text-blue">
                    {recipient.telegramUsername ? `@${recipient.telegramUsername}` : t("notifications.linkedAccount")}
                  </td>
                  <td className="px-4 py-3">
                    {recipient.source === "admin" ? (
                      <div>
                        <p>{recipient.adminName || t("notifications.adminLabel")}</p>
                        <p className="text-[12px] text-muted-foreground">{recipient.adminEmail}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{t("notifications.notificationOnly")}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {recipient.linkedAt ? formatAdminDateTime(recipient.linkedAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {recipient.isCurrentUser
                      ? t("notifications.yourAccountType")
                      : recipient.source === "admin"
                        ? t("notifications.adminLabel")
                        : t("notifications.additional")}
                  </td>
                  <td className="px-4 py-3">
                    {recipient.isCurrentUser || recipient.source === "extra" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setRemoveKey(recipient.key)}
                        aria-label={t("notifications.removeRecipientAria")}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-muted-foreground hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">{t("notifications.managedByAdmin")}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[14px]">
        {t("notifications.yourAccount")}{" "}
        {linked ? (
          <span className="font-medium text-blue">
            {username ? t("notifications.linkedAs", { username }) : t("notifications.linked")}
            {linkedAt ? ` · ${formatAdminDateTime(linkedAt)}` : ""}
          </span>
        ) : (
          <span className="text-muted-foreground">{t("notifications.notLinked")}</span>
        )}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy || !webhookHealthy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            setMessage(null);
            try {
              const link = await createTelegramLink();
              previousLinkedAt.current = linkedAt;
              setUrl(link);
              setLinkKind("self");
              setWaitingForLink(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : t("notifications.createLinkError"));
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-md bg-blue px-4 py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
        >
          {linked ? t("notifications.reconnect") : t("notifications.connect")}
        </button>
        <button
          type="button"
          disabled={busy || recipients.length === 0}
          onClick={async () => {
            setBusy(true);
            setError(null);
            setMessage(null);
            try {
              const result = await sendTestTelegramAlert();
              setMessage(
                result.sent === 1
                  ? t("notifications.testSent", { count: result.sent })
                  : t("notifications.testSentPlural", { count: result.sent }),
              );
            } catch (err) {
              setError(err instanceof Error ? err.message : t("notifications.testError"));
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-md border border-hairline px-4 py-2.5 text-[14px] disabled:opacity-60"
        >
          {t("notifications.sendTest")}
        </button>
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
          {t("notifications.refreshWebhook")}
        </button>
      </div>
      {url ? (
        <div className="space-y-2 text-[14px]">
          <p>
            {linkKind === "extra" ? t("notifications.shareLink") : t("notifications.openLink")}{" "}
            <a href={url} className="break-all text-blue hover:underline" target="_blank" rel="noreferrer">
              {url}
            </a>
          </p>
          {waitingForLink ? (
            <p className="text-[13px] text-muted-foreground">{t("notifications.waitingLink")}</p>
          ) : null}
        </div>
      ) : null}
      {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
      {message ? <p className="text-[13px] text-graphite">{message}</p> : null}

      {toRemove ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/35 px-4" onClick={() => setRemoveKey(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-telegram-title"
            className="w-full max-w-md rounded-xl border border-hairline bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="remove-telegram-title" className="font-display text-xl text-graphite">
              {t("notifications.removeTelegramTitle")}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              {t("notifications.removeTelegramBody", {
                name: toRemove.telegramUsername ? `@${toRemove.telegramUsername}` : t("notifications.thisAccount"),
              })}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRemoveKey(null)}
                className="rounded-md border border-hairline px-3 py-2 text-[13px] font-medium text-graphite hover:bg-ivory"
              >
                {common("cancel")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  try {
                    await disconnectTelegramRecipient(toRemove.telegramUserId);
                    setRemoveKey(null);
                    router.refresh();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : t("notifications.removeTelegramError"));
                  } finally {
                    setBusy(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-[13px] font-medium text-white hover:bg-destructive/90"
              >
                <Trash2 size={14} />
                {t("notifications.remove")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
