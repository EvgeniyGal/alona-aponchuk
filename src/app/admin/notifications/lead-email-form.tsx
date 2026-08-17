"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { saveLeadNotificationEmails } from "@/app/admin/notifications/actions";
import { cn } from "@/lib/utils";

const fieldCls =
  "w-full rounded-md border border-hairline bg-white px-3 py-2.5 text-[14px] outline-none focus:border-blue";

export function LeadEmailsForm({ initialEmails }: { initialEmails: string[] }) {
  const [emails, setEmails] = useState(initialEmails.length > 0 ? initialEmails : [""]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  const emailToRemove = removeIndex === null ? null : emails[removeIndex];

  return (
    <form
      className="mt-6 rounded-xl border border-hairline bg-white p-5"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        setError(null);
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await saveLeadNotificationEmails(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setEmails(result.leadEmails);
          setMessage(`Saved ${result.leadEmails.length} notification email${result.leadEmails.length === 1 ? "" : "s"}.`);
        });
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg">Lead notification emails</h2>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            New chat assessment leads and contact-form submissions are emailed to every address listed here.
          </p>
        </div>
        <button
          type="button"
          disabled={pending || emails.length >= 10}
          onClick={() => setEmails((current) => [...current, ""])}
          className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-blue hover:underline disabled:opacity-60"
        >
          <Plus size={14} />
          Add email
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {emails.map((email, index) => (
          <div key={index} className="flex gap-2">
            <input
              className={fieldCls}
              type="email"
              name="leadEmails"
              required={emails.length === 1}
              value={email}
              onChange={(event) => {
                setEmails((current) => current.map((item, i) => (i === index ? event.target.value : item)));
              }}
              placeholder="info@aponchukworkflow.com"
            />
            <button
              type="button"
              disabled={emails.length === 1 || pending}
              onClick={() => setRemoveIndex(index)}
              aria-label="Remove email"
              className={cn(
                "inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-hairline text-muted-foreground hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive disabled:opacity-40",
              )}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {error ? <p className="mt-3 text-[13px] text-destructive">{error}</p> : null}
      {message ? <p className="mt-3 text-[13px] text-graphite">{message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-blue px-4 py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save emails"}
      </button>

      {removeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/35 px-4"
          onClick={() => setRemoveIndex(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-email-title"
            className="w-full max-w-md rounded-xl border border-hairline bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="remove-email-title" className="font-display text-xl text-graphite">
              Remove email?
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              {emailToRemove?.trim() ? (
                <>
                  Remove <span className="font-medium text-graphite">{emailToRemove.trim()}</span> from the
                  notification list? Click Save emails to apply changes.
                </>
              ) : (
                <>Remove this empty email row?</>
              )}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRemoveIndex(null)}
                className="rounded-md border border-hairline px-3 py-2 text-[13px] font-medium text-graphite hover:bg-ivory"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmails((current) => current.filter((_, i) => i !== removeIndex));
                  setRemoveIndex(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-[13px] font-medium text-white hover:bg-destructive/90"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
