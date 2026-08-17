import { getTranslations } from "next-intl/server";
import { PageHero, Section } from "@/components/page-shell";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { translatedPageMetadata } from "@/i18n/page-metadata";

export async function generateMetadata() {
  return translatedPageMetadata({
    namespace: "mission",
    path: "/mission",
    image: "/images/home-mission-continuum.webp",
  });
}

export default async function MissionPage() {
  const t = await getTranslations("mission");
  const believe = t.raw("believe") as string[];
  const work = t.raw("work") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        image={{
          filename: "home-mission-continuum.webp",
          label: t("imageLabel"),
          tone: "sage",
        }}
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal variant="up">
            <div className="service-card h-full rounded-2xl border border-hairline bg-white p-8">
              <h2 className="font-display text-2xl text-graphite">{t("believeTitle")}</h2>
              <ul className="mt-5 space-y-3.5 text-[15px] text-muted-foreground leading-relaxed">
                {believe.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal variant="up" delayMs={80}>
            <div className="service-card h-full rounded-2xl border border-hairline bg-white p-8">
              <h2 className="font-display text-2xl text-graphite">{t("workTitle")}</h2>
              <ul className="mt-5 space-y-3.5 text-[15px] text-muted-foreground leading-relaxed">
                {work.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
