"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ChatWidget } from "@/components/chat/chat-widget";
import { JsonLd } from "@/components/json-ld";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <JsonLd />
      <SmoothScroll />
      <ScrollProgress />
      <div className="flex min-h-dvh flex-col bg-ivory">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <ScrollToTop />
      <ChatWidget />
    </>
  );
}
