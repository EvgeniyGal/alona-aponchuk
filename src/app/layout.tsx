import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AppChrome } from "@/components/app-chrome";
import { LocaleSync } from "@/components/locale-sync";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import { localeHtmlLang, localeOg, parseAppLocale } from "@/i18n/config";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-display-family",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans-family",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.legalName,
  authors: [{ name: siteConfig.name, url: absoluteUrl("/about") }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  keywords: [...siteConfig.keywords],
  category: "business",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: ["/favicon.png"],
  },
  manifest: undefined,
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: localeOg.en,
    url: siteConfig.url,
    siteName: `${siteConfig.name} — ${siteConfig.legalName}`,
    title: "Alona Aponchuk — CRM Workflow & Client Journey Automation",
    description:
      "Reliable Workflows. Better Client Journeys. Responsible AI. Consulting for healthcare and wellness organizations across the United States.",
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — CRM workflow and client journey consulting`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alona Aponchuk — CRM Workflow & Client Journey Automation",
    description:
      "Reliable Workflows. Better Client Journeys. Responsible AI. Consulting for healthcare and wellness organizations across the United States.",
    images: [siteConfig.defaultOgImage],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = parseAppLocale(await getLocale());
  const messages = await getMessages();

  return (
    <html lang={localeHtmlLang[locale]} className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LocaleSync />
          <AppChrome>{children}</AppChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
