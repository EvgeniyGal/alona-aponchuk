import { parseAppLocale, type AppLocale } from "@/i18n/config";

const DATE_LOCALES: Record<AppLocale, string> = {
  en: "en-US",
  uk: "uk-UA",
  ru: "ru-RU",
};

const ADMIN_DATE_TIME: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
};

/** Locale-aware formatter. Pass the active locale so SSR and client hydration match. */
export function formatAdminDateTime(value: string | Date, locale?: string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const appLocale = parseAppLocale(locale);
  return date.toLocaleString(DATE_LOCALES[appLocale], {
    ...ADMIN_DATE_TIME,
    hour12: appLocale === "en",
  });
}
