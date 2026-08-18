"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  Bell,
  BookOpen,
  Bot,
  Files,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useHasMounted } from "@/lib/use-has-mounted";
import { cn } from "@/lib/utils";

const linkKeys = [
  { href: "/admin", key: "overview", icon: LayoutDashboard },
  { href: "/admin/leads", key: "leads", icon: UserPlus },
  { href: "/admin/sessions", key: "sessions", icon: MessageSquare },
  { href: "/admin/knowledge-base", key: "knowledgeBase", icon: BookOpen },
  { href: "/admin/rag", key: "rag", icon: Files },
  { href: "/admin/settings", key: "settings", icon: Bot },
  { href: "/admin/notifications", key: "notifications", icon: Bell },
  { href: "/admin/users", key: "users", icon: Users },
] as const;

const publicPrefixes = ["/admin/login", "/admin/invite", "/admin/forgot-password", "/admin/reset-password"];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("admin");
  const common = useTranslations("common");
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useHasMounted();
  const isPublic = publicPrefixes.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (isPublic) {
    return <div className="min-h-dvh bg-ivory text-graphite">{children}</div>;
  }

  function isActive(href: string) {
    if (!mounted) return false;
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 px-3">
      {linkKeys.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors",
              active
                ? "bg-blue-soft/70 font-medium text-blue"
                : "text-graphite/75 hover:bg-ivory hover:text-blue",
            )}
          >
            <Icon size={16} className="shrink-0" />
            {t(`nav.${link.key}`)}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-ivory text-graphite lg:flex">
      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-graphite/25 lg:hidden"
          aria-label={common("toggleMenu")}
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-60 shrink-0 flex-col border-r border-hairline bg-white transition-transform lg:sticky lg:top-0 lg:z-0 lg:translate-x-0",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-2 border-b border-hairline px-5 py-4">
          <div>
            <p className="font-display text-[15px] font-semibold">{t("brand")}</p>
            <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">{t("tagline")}</p>
          </div>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-graphite lg:hidden"
            aria-label={common("toggleMenu")}
            onClick={() => setMenuOpen(false)}
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto py-3">{nav}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-hairline bg-white px-4 py-2.5 lg:px-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline text-graphite lg:hidden"
            aria-label={common("toggleMenu")}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher compact />
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/admin/login" })}
              className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-graphite"
            >
              <LogOut size={14} />
              {t("signOut")}
            </button>
          </div>
        </header>
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-6">{children}</div>
      </div>
    </div>
  );
}
