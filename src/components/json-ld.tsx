import { organizationJsonLd } from "@/lib/seo";

export function JsonLd() {
  const data = organizationJsonLd();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
