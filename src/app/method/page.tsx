import { getTranslations } from "next-intl/server";
import { PageHero, Section } from "@/components/page-shell";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { translatedPageMetadata } from "@/i18n/page-metadata";

export async function generateMetadata() {
  return translatedPageMetadata({
    namespace: "method",
    path: "/method",
    image: "/images/home-service-workflow-audit.webp",
  });
}

export default async function MethodPage() {
  const t = await getTranslations("method");
  const steps = t.raw("steps") as Array<{ title: string; body: string }>;

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        image={{
          filename: "home-service-workflow-audit.webp",
          label: t("imageLabel"),
          tone: "blue",
        }}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal key={s.title} delayMs={i * 50} variant="up">
              <article className="layer-card h-full rounded-2xl border border-hairline bg-white p-8 flex gap-6">
                <div className="shrink-0">
                  <div className="font-display text-5xl md:text-6xl font-semibold text-blue leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("stepLabel")}</div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-xl md:text-2xl text-graphite">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
