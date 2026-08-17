"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/knowledge-base", label: "Knowledge base" },
  { href: "/admin/settings", label: "Assistant" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/users", label: "Users" },
];

const publicPrefixes = ["/admin/login", "/admin/invite", "/admin/forgot-password", "/admin/reset-password"];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = publicPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isPublic) {
    return <div className="min-h-dvh bg-ivory text-graphite">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-ivory text-graphite">
      <header className="border-b border-hairline bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="font-display text-[15px] font-semibold">Aponchuk Admin</p>
            <p className="text-[11.5px] text-muted-foreground">Lead and assistant console</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-[13.5px]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname.startsWith(link.href) ? "font-medium text-blue" : "text-graphite/75 hover:text-blue"
                }
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/admin/login" })}
              className="text-muted-foreground hover:text-graphite"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
