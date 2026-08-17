import type { AppLocale } from "./config";
import { defaultLocale, parseAppLocale } from "./config";
import en from "../../messages/en.json";
import uk from "../../messages/uk.json";
import ru from "../../messages/ru.json";

const catalogs = { en, uk, ru } as const;

export type MessageCatalog = typeof en;

export function getCatalog(locale?: string | null): MessageCatalog {
  const resolved = parseAppLocale(locale ?? defaultLocale);
  return catalogs[resolved] as MessageCatalog;
}

export function getChatCatalog(locale?: string | null) {
  return getCatalog(locale).chat;
}

export function getAdminCatalog(locale?: string | null) {
  return getCatalog(locale).admin;
}

export function languageInstruction(locale: AppLocale) {
  return getCatalog(locale).chat.llmLanguageInstruction;
}
