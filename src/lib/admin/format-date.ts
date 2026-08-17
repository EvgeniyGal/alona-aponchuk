const ADMIN_DATE_TIME: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
};

/** Fixed-locale formatter so SSR and client hydration produce identical output. */
export function formatAdminDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("en-US", ADMIN_DATE_TIME);
}
