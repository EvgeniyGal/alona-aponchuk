import { getTranslations } from "next-intl/server";
import { PageHero, Section } from "@/components/page-shell";
import { CtaBand } from "@/components/cta-band";
import { CheckCircle2, XCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { translatedPageMetadata } from "@/i18n/page-metadata";

export async function generateMetadata() {
  return translatedPageMetadata({
    namespace: "responsibleAi",
    path: "/responsible-ai",
    image: "/images/home-five-layer-system.webp",
  });
}

export default async function ResponsibleAiPage() {
  const t = await getTranslations("responsibleAi");
  const allowed = t.raw("allowed") as string[];
  const notAllowed = t.raw("notAllowed") as string[];
  const generic = t.raw("generic") as string[];
  const calibrated = t.raw("calibrated") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        image={{
          filename: "home-five-layer-system.webp",
          label: t("imageLabel"),
          tone: "blue",
        }}
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal variant="up">
            <div className="service-card h-full rounded-2xl border border-teal/40 bg-teal-soft/40 p-8">
              <h2 className="font-display text-xl md:text-2xl text-graphite">{t("allowedTitle")}</h2>
              <ul className="mt-5 space-y-3">
                {allowed.map((a) => (
                  <li key={a} className="flex gap-3 text-[15px] text-graphite leading-relaxed">
                    <CheckCircle2 size={18} className="mt-0.5 text-teal shrink-0" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal variant="up" delayMs={80}>
            <div className="service-card h-full rounded-2xl border border-hairline bg-white p-8">
              <h2 className="font-display text-xl md:text-2xl text-graphite">{t("notAllowedTitle")}</h2>
              <ul className="mt-5 space-y-3">
                {notAllowed.map((a) => (
                  <li key={a} className="flex gap-3 text-[15px] text-graphite leading-relaxed">
                    <XCircle size={18} className="mt-0.5 text-gold shrink-0" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-end">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow">{t("compareEyebrow")}</div>
              <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
                {t("compareTitle")}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("compareLead")}
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={80} className="hidden lg:block">
            <ImagePlaceholder
              label={t("compareImage")}
              filename="home-service-automation-readiness.webp"
              aspect="landscape"
              tone="teal"
              className="rounded-xl"
            />
          </Reveal>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal variant="up">
            <div className="service-card h-full rounded-2xl border border-hairline p-8 bg-white">
              <div className="eyebrow" style={{ color: "#8a6a2b" }}>{t("genericEyebrow")}</div>
              <ul className="mt-5 space-y-3">
                {generic.map((g) => (
                  <li key={g} className="text-[15px] text-muted-foreground leading-relaxed">· {g}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal variant="up" delayMs={80}>
            <div className="service-card h-full rounded-2xl border border-teal/40 bg-teal-soft/40 p-8">
              <div className="eyebrow" style={{ color: "#2f6f77" }}>{t("calibratedEyebrow")}</div>
              <ul className="mt-5 space-y-3">
                {calibrated.map((g) => (
                  <li key={g} className="text-[15px] text-graphite leading-relaxed">· {g}</li>
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
