import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollToTop } from "@/components/scroll-to-top";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Alona Aponchuk — CRM Workflow & Client Journey Automation for Healthcare & Wellness",
    template: "%s | Alona Aponchuk",
  },
  description:
    "Alona Aponchuk helps healthcare and wellness organizations improve CRM workflows, client journeys, scheduling, follow-up, and AI-mediated communication through structured workflow analysis, QA validation, and RAG-ready automation design.",
  authors: [{ name: "Aponchuk Workflow Systems LLC" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    siteName: "Alona Aponchuk — Aponchuk Workflow Systems LLC",
    type: "website",
    title: "Alona Aponchuk — CRM Workflow & Client Journey Automation",
    description:
      "Reliable Workflows. Better Client Journeys. Responsible AI. Consulting for healthcare and wellness organizations across the United States.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <SmoothScroll />
        <ScrollProgress />
        <div className="flex min-h-dvh flex-col bg-ivory">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <ScrollToTop />
      </body>
    </html>
  );
}
