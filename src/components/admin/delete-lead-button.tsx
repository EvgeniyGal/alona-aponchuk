"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { deleteLeadById } from "@/app/admin/leads/actions";
import { cn } from "@/lib/utils";

function DeleteLeadDialog({
  open,
  leadName,
  pending,
  error,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  leadName: string;
  pending: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("admin");
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
        aria-labelledby="delete-lead-title"
        className="w-full max-w-md rounded-xl border border-hairline bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-lead-title" className="font-display text-xl text-graphite">
          {t("leadDetail.deleteTitle")}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {t("leadDetail.deleteBody", { name: leadName })}
        </p>
        {error ? <p className="mt-3 text-[13px] text-destructive">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="rounded-md border border-hairline px-3 py-2 text-[13px] font-medium text-graphite hover:bg-ivory disabled:opacity-60"
          >
            {common("cancel")}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-[13px] font-medium text-white hover:bg-destructive/90 disabled:opacity-60"
          >
            <Trash2 size={14} />
            {pending ? t("leadDetail.deleting") : t("leadDetail.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeleteLeadButton({
  leadId,
  leadName,
  onDeleted,
  className,
  variant = "icon",
}: {
  leadId: string;
  leadName: string;
  onDeleted?: () => void;
  className?: string;
  variant?: "icon" | "button";
}) {
  const t = useTranslations("admin");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleOpen(event: React.MouseEvent) {
    event.stopPropagation();
    setError(null);
    setOpen(true);
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteLeadById(leadId);
      if (!result.ok) {
        setError(result.error || t("leadDetail.deleteError"));
        return;
      }
      setOpen(false);
      onDeleted?.();
    });
  }

  return (
    <>
      {variant === "button" ? (
        <button
          type="button"
          disabled={pending}
          onClick={handleOpen}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-2 text-[13px] font-medium text-destructive hover:bg-destructive/5 disabled:opacity-60",
            className,
          )}
        >
          <Trash2 size={14} />
          {t("leadDetail.delete")}
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={handleOpen}
          aria-label={`${t("leadDetail.delete")} ${leadName}`}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-muted-foreground hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive disabled:opacity-60",
            className,
          )}
        >
          <Trash2 size={14} />
        </button>
      )}

      <DeleteLeadDialog
        open={open}
        leadName={leadName}
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
