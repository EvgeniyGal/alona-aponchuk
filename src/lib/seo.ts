import type { Metadata } from "next";

export const siteConfig = {
  name: "Alona Aponchuk",
  legalName: "Aponchuk Workflow Systems LLC",
  title: "Alona Aponchuk — CRM Workflow & Client Journey Automation for Healthcare & Wellness",
  description:
    "Alona Aponchuk helps healthcare and wellness organizations improve CRM workflows, client journeys, scheduling, follow-up, and AI-mediated communication through structured workflow analysis, QA validation, and RAG-ready automation design.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.aponchukworkflow.com",
  locale: "en_US",
  email: "info@aponchukworkflow.com",
  phone: undefined as string | undefined,
  location: {
    city: "Sarasota",
    region: "FL",
    country: "US",
  },
  linkedIn: "https://www.linkedin.com/in/alona-aponchuk/",
  orcid: "https://orcid.org/0009-0008-3505-7871",
  twitterHandle: undefined as string | undefined,
  keywords: [
    "CRM workflow consulting",
    "client journey automation",
    "healthcare CRM",
    "wellness clinic operations",
    "RAG chatbot readiness",
    "responsible AI healthcare",
    "workflow audit",
    "patient management systems",
    "QA validation",
    "Sarasota Florida consultant",
    "Aponchuk Workflow Systems",
    "Alona Aponchuk",
  ],
  defaultOgImage: "/images/home-hero-operations.webp",
} as const;

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  /** Use absolute title without layout template suffix */
  absoluteTitle?: boolean;
  type?: "website" | "article";
};

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  image = siteConfig.defaultOgImage,
  imageAlt = `${siteConfig.name} — ${siteConfig.legalName}`,
  noIndex = false,
  absoluteTitle = false,
  type = "website",
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: `${siteConfig.name} — ${siteConfig.legalName}`,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      ...(siteConfig.twitterHandle ? { creator: siteConfig.twitterHandle, site: siteConfig.twitterHandle } : {}),
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.legalName,
        url: siteConfig.url,
        email: siteConfig.email,
        logo: absoluteUrl("/logo.webp"),
        sameAs: [siteConfig.linkedIn, siteConfig.orcid],
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.location.city,
          addressRegion: siteConfig.location.region,
          addressCountry: siteConfig.location.country,
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#service`,
        name: siteConfig.legalName,
        url: siteConfig.url,
        image: absoluteUrl(siteConfig.defaultOgImage),
        description: siteConfig.description,
        email: siteConfig.email,
        areaServed: {
          "@type": "Country",
          name: "United States",
        },
        serviceType: [
          "CRM workflow consulting",
          "Client journey automation",
          "Automation readiness",
          "QA validation",
          "Responsible AI communication design",
        ],
        founder: {
          "@type": "Person",
          name: siteConfig.name,
          jobTitle: "CRM, Patient Management & Digital Workflow Systems Specialist",
          url: absoluteUrl("/about"),
          sameAs: [siteConfig.linkedIn, siteConfig.orcid],
        },
        provider: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };
}
