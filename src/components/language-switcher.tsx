"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { GB, RU, UA } from "country-flag-icons/react/3x2";
import {
  locales,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  localeNativeNames,
  type AppLocale,
} from "@/i18n/config";
import { cn } from "@/lib/utils";

const flags: Record<AppLocale, typeof GB> = {
  en: GB,
  uk: UA,
  ru: RU,
};

function persistLocale(locale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}

function FlagIcon({ locale, large = false }: { locale: AppLocale; large?: boolean }) {
  const Flag = flags[locale];
  return (
    <span className="inline-flex overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(31,41,51,0.14)]">
      <Flag
        title={localeNativeNames[locale]}
        className={large ? "h-5 w-[30px]" : "h-[14px] w-[21px]"}
        aria-hidden
      />
    </span>
  );
}

export function LanguageSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const t = useTranslations("common");
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  function select(next: AppLocale) {
    setOpen(false);
    if (next === locale) return;
    persistLocale(next);
    startTransition(() => {
      router.refresh();
    });
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative z-20", className)}>
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex cursor-pointer items-center justify-center rounded-[3px] opacity-90 transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={t("language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
      >
        <FlagIcon locale={locale} large={!compact} />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("language")}
          className="absolute right-0 top-[calc(100%+6px)] min-w-[11.5rem] overflow-hidden rounded-lg border border-hairline bg-white py-1 shadow-[0_12px_28px_-16px_rgba(31,41,51,0.45)]"
        >
          {locales.map((item) => (
            <li key={item} role="option" aria-selected={item === locale}>
              <button
                type="button"
                disabled={pending}
                onClick={() => select(item)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-[13.5px] transition-colors hover:bg-muted",
                  item === locale ? "bg-blue-soft/70 font-medium text-blue" : "text-graphite",
                )}
              >
                <FlagIcon locale={item} />
                <span>{localeNativeNames[item]}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { persistLocale };
