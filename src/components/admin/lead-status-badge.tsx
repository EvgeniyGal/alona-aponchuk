"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LEAD_STATUS_CONFIG, LEAD_STATUS_I18N_KEYS, type LeadStatus } from "@/lib/admin/lead-status";

export function LeadStatusBadge({
  status,
  className,
}: {
  status: LeadStatus;
  className?: string;
}) {
  const t = useTranslations("admin");
  const config = LEAD_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium capitalize",
        config.badge,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} aria-hidden />
      {t(`leads.${LEAD_STATUS_I18N_KEYS[status]}`)}
    </span>
  );
}
