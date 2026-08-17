"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";

const linkKeys = [
  { href: "/admin", key: "overview" },
  { href: "/admin/leads", key: "leads" },
  { href: "/admin/sessions", key: "sessions" },
  { href: "/admin/knowledge-base", key: "knowledgeBase" },
  { href: "/admin/rag", key: "rag" },
  { href: "/admin/settings", key: "settings" },
  { href: "/admin/notifications", key: "notifications" },
  { href: "/admin/users", key: "users" },
] as const;

const publicPrefixes = ["/admin/login", "/admin/invite", "/admin/forgot-password", "/admin/reset-password"];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("admin");
  const isPublic = publicPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isPublic) {
    return <div className="min-h-dvh bg-ivory text-graphite">{children}</div>;
  }

  const isOverview = pathname === "/admin";
  const widthClass = isOverview ? "max-w-7xl" : "max-w-6xl";

  return (
    <div className="min-h-dvh bg-ivory text-graphite">
      <header className="border-b border-hairline bg-white">
        <div className={cn("mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3", widthClass)}>
          <div>
            <p className="font-display text-[15px] font-semibold">{t("brand")}</p>
            <p className="text-[11.5px] text-muted-foreground">{t("tagline")}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-[13.5px]">
            {linkKeys.map((link) => {
              const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={active ? "font-medium text-blue" : "text-graphite/75 hover:text-blue"}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              );
            })}
            <LanguageSwitcher compact />
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/admin/login" })}
              className="text-muted-foreground hover:text-graphite"
            >
              {t("signOut")}
            </button>
          </nav>
        </div>
      </header>
      <div className={cn("mx-auto px-4 py-8", widthClass)}>{children}</div>
    </div>
  );
}
