import { getTranslations } from "next-intl/server";
import { PageHero, Section } from "@/components/page-shell";
import { translatedPageMetadata } from "@/i18n/page-metadata";

export async function generateMetadata() {
  return translatedPageMetadata({
    namespace: "terms",
    path: "/terms",
    hasImageAlt: false,
    noIndex: true,
  });
}

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const sections = t.raw("sections") as Array<{ title: string; body: string }>;

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead", { date: t("effectiveDate") })}
      />
      <Section>
        <div className="space-y-6 max-w-3xl">
          {sections.map((s) => (
            <article key={s.title} className="rounded-2xl border border-hairline bg-white p-7">
              <h2 className="font-display text-xl text-graphite">{s.title}</h2>
              <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">{s.body}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
