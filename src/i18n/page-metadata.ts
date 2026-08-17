import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { createPageMetadata } from "@/lib/seo";
import { localeOg, parseAppLocale } from "@/i18n/config";

type SeoCopy = {
  title: string;
  description: string;
  imageAlt?: string;
};

export async function translatedPageMetadata({
  namespace,
  path,
  image,
  hasImageAlt = true,
  noIndex = false,
  absoluteTitle = false,
}: {
  namespace: string;
  path: string;
  image?: string;
  hasImageAlt?: boolean;
  noIndex?: boolean;
  absoluteTitle?: boolean;
}): Promise<Metadata> {
  const locale = parseAppLocale(await getLocale());
  const messages = (await getMessages()) as Record<string, { seo?: SeoCopy }>;
  const seo = messages[namespace]?.seo;
  if (!seo) {
    throw new Error(`Missing SEO copy for namespace "${namespace}"`);
  }

  const metadata = createPageMetadata({
    title: seo.title,
    description: seo.description,
    path,
    image,
    imageAlt: hasImageAlt ? seo.imageAlt : undefined,
    noIndex,
    absoluteTitle,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      locale: localeOg[locale],
    },
  };
}
