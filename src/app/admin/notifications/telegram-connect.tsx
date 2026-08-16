"use client";

import { useState } from "react";
import { createTelegramLink, disconnectTelegram } from "./actions";

export function TelegramConnect({
  linked,
  username,
}: {
  linked: boolean;
  username: string | null;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      <p className="text-[13.5px] text-muted-foreground">
        Only approved admins who connect Telegram here receive lead summaries. Unregistered Telegram accounts cannot
        subscribe by messaging the bot.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              const link = await createTelegramLink();
              setUrl(link);
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
      </div>
      {url ? (
        <p className="text-[14px]">
          Open this link in Telegram within 10 minutes:{" "}
          <a href={url} className="break-all text-blue hover:underline" target="_blank" rel="noreferrer">
            {url}
          </a>
        </p>
      ) : null}
      {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
    </div>
  );
}
