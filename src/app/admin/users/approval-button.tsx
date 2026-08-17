"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { setUserApproved } from "./actions";
import { cn } from "@/lib/utils";

export function UserApprovalButton({ userId, approved }: { userId: string; approved: boolean }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await setUserApproved(userId, !approved);
        });
      }}
      className={cn(
        "rounded-md border px-3 py-1.5 text-[13px] font-medium disabled:opacity-60",
        approved
          ? "border-destructive/30 text-destructive hover:bg-destructive/5"
          : "border-hairline text-graphite hover:bg-ivory",
      )}
    >
      {pending ? (approved ? t("users.revoking") : t("users.restoring")) : approved ? t("users.revoke") : t("users.restore")}
    </button>
  );
}
