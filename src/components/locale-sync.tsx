"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  parseAppLocale,
  type AppLocale,
} from "@/i18n/config";

export function LocaleSync() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      stored = null;
    }

    if (stored) {
      const next = parseAppLocale(stored);
      if (next !== locale) {
        document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
        router.refresh();
        return;
      }
    }

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
  }, [locale, router]);

  return null;
}
