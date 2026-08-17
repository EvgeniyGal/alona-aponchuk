export const locales = ["en", "uk", "ru"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const LOCALE_COOKIE = "alona_locale";
export const LOCALE_STORAGE_KEY = "alona.locale";

export const localeHtmlLang: Record<AppLocale, string> = {
  en: "en",
  uk: "uk",
  ru: "ru",
};

export const localeOg: Record<AppLocale, string> = {
  en: "en_US",
  uk: "uk_UA",
  ru: "ru_RU",
};

export const localeShortLabels: Record<AppLocale, string> = {
  en: "EN",
  uk: "УК",
  ru: "РУ",
};

export const localeNativeNames: Record<AppLocale, string> = {
  en: "English",
  uk: "Українська",
  ru: "Русский",
};

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  uk: "Ukrainian",
  ru: "Russian",
};

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return value === "en" || value === "uk" || value === "ru";
}

export function parseAppLocale(value: string | null | undefined): AppLocale {
  return isAppLocale(value) ? value : defaultLocale;
}
