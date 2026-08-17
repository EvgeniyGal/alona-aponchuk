"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Trash2 } from "lucide-react";
import { deleteUserById } from "./actions";

function DeleteUserDialog({
  open,
  userName,
  pending,
  error,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  userName: string;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("admin.users");
  const common = useTranslations("common");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onCancel();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/35 px-4"
      onClick={() => {
        if (!pending) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-user-title"
        className="w-full max-w-md rounded-xl border border-hairline bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-user-title" className="font-display text-xl text-graphite">
          {t("deleteTitle")}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {t("deleteBody", { name: userName })}
        </p>
        {error ? <p className="mt-3 text-[13px] text-destructive">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="cursor-pointer rounded-md border border-hairline px-3 py-2 text-[13px] font-medium text-graphite hover:bg-ivory disabled:opacity-60"
          >
            {common("cancel")}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-[13px] font-medium text-white hover:bg-destructive/90 disabled:opacity-60"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {pending ? t("deleting") : t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const t = useTranslations("admin.users");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteUserById(userId);
      if (!result.ok) {
        setError(result.error || t("deleteError"));
        return;
      }
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        aria-label={`${t("delete")} ${userName}`}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-hairline text-muted-foreground hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive disabled:opacity-60"
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>
      <DeleteUserDialog
        open={open}
        userName={userName}
        pending={pending}
        error={error}
        onCancel={() => {
          if (!pending) {
            setError(null);
            setOpen(false);
          }
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}
