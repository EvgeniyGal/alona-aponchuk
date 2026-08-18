"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", key: "home" },
  { to: "/mission", key: "mission" },
  { to: "/method", key: "method" },
  { to: "/services", key: "services" },
  { to: "/case-stories", key: "caseStories" },
  { to: "/responsible-ai", key: "responsibleAi" },
  { to: "/research", key: "research" },
  { to: "/about", key: "about" },
] as const;

function isActive(pathname: string, to: string) {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname || "/";
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const mounted = useHasMounted();
  const t = useTranslations("nav");
  const common = useTranslations("common");

  function navClass(to: string, mobile = false) {
    const active = mounted && isActive(pathname, to);
    if (mobile) {
      return cn(
        "border-b border-hairline py-3 text-[15px] last:border-b-0",
        active
          ? "font-medium text-blue underline decoration-blue decoration-1 underline-offset-[6px]"
          : "text-graphite",
      );
    }
    return cn(
      "text-[14px] transition-colors",
      active
        ? "font-medium text-blue underline decoration-blue decoration-1 underline-offset-[7px]"
        : "text-graphite/80 hover:text-blue",
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ivory/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/logo.webp"
            alt={t("logoAlt")}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 object-contain"
            priority
          />
          <span className="font-display text-[15.5px] font-semibold leading-tight text-graphite hidden sm:block">
            Alona Aponchuk
            <span className="block text-[11.5px] font-normal text-muted-foreground">{t("tagline")}</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <Link key={n.to} href={n.to} className={navClass(n.to)} suppressHydrationWarning>
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center rounded-md bg-blue px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-blue/90 transition-colors"
          >
            {common("requestAudit")}
          </Link>
          <button
            aria-label={common("toggleMenu")}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-hairline text-graphite"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-hairline bg-ivory">
          <div className="container-page py-3 flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                className={navClass(n.to, true)}
                suppressHydrationWarning
                onClick={() => setOpen(false)}
              >
                {t(n.key)}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-4 mb-2 inline-flex justify-center rounded-md bg-blue px-4 py-3 text-[14px] font-medium text-white"
              onClick={() => setOpen(false)}
            >
              {common("requestAudit")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
