import { getTranslations } from "next-intl/server";
import { PageHero, Section } from "@/components/page-shell";
import { CtaBand } from "@/components/cta-band";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { translatedPageMetadata } from "@/i18n/page-metadata";

export async function generateMetadata() {
  return translatedPageMetadata({
    namespace: "research",
    path: "/research",
    image: "/images/home-research-methodology.webp",
  });
}

export default async function ResearchPage() {
  const t = await getTranslations("research");
  const layers = t.raw("layers") as Array<{ code: string; title: string; body: string }>;
  const metrics = t.raw("metrics") as Array<{ code: string; name: string; body: string }>;
  const publications = t.raw("publications") as Array<{
    role: string;
    title: string;
    doi: string;
    url: string;
    venue?: string;
  }>;

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        image={{
          filename: "home-research-methodology.webp",
          label: t("imageLabel"),
          tone: "teal",
        }}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-end">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow">{t("systemEyebrow")}</div>
              <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
                {t("systemTitle")}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("systemLead")}
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={80} className="hidden lg:block">
            <ImagePlaceholder
              label={t("systemImage")}
              filename="home-five-layer-system.webp"
              aspect="landscape"
              tone="blue"
              className="rounded-xl"
            />
          </Reveal>
        </div>

        <div className="mt-12 hidden md:grid grid-cols-6 gap-3 items-stretch">
          {layers.map((l, i) => (
            <Reveal key={l.code} delayMs={i * 40} variant="up" className="relative flex">
              <div className="layer-card w-full rounded-xl border border-hairline bg-white p-4 lg:p-5 flex flex-col">
                <div className="text-[11px] font-semibold text-blue">{t("layer", { code: l.code })}</div>
                <div className="mt-2 font-display text-[15px] lg:text-[16px] font-semibold text-graphite leading-snug">
                  {l.title}
                </div>
                <p className="mt-2 text-[12.5px] text-muted-foreground leading-relaxed">{l.body}</p>
              </div>
              {i < layers.length - 1 && (
                <div
                  aria-hidden
                  className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 items-center justify-center text-blue/60"
                >
                  <ArrowRight size={14} />
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <div className="mt-10 md:hidden">
          <ol className="relative space-y-4">
            {layers.map((l, i) => (
              <li key={l.code}>
                <Reveal delayMs={i * 40}>
                  <div className="w-full rounded-2xl border border-hairline bg-white p-5">
                    <div className="text-[11px] font-semibold text-blue">{t("layer", { code: l.code })}</div>
                    <div className="mt-1.5 font-display text-[16px] font-semibold text-graphite">{l.title}</div>
                    <p className="mt-2 text-[13.5px] text-muted-foreground leading-relaxed">{l.body}</p>
                  </div>
                </Reveal>
                {i < layers.length - 1 && (
                  <div className="flex justify-center py-2 text-blue/60" aria-hidden>
                    <ChevronDown size={18} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <Reveal>
          <p className="mt-8 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
            {t("diagramNote")}
          </p>
        </Reveal>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <Reveal>
          <div className="max-w-2xl">
            <div className="eyebrow">{t("metricsEyebrow")}</div>
            <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
              {t("metricsTitle")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("metricsLead")}
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {metrics.map((m, i) => (
            <Reveal key={m.code} delayMs={i * 70} variant="up">
              <div className="layer-card h-full rounded-2xl border border-hairline p-8 bg-ivory/60">
                <div className="layer-icon w-14 h-14 rounded-lg bg-teal-soft text-teal flex items-center justify-center font-display font-semibold">
                  {m.code}
                </div>
                <h3 className="mt-5 font-display text-lg text-graphite">{m.name}</h3>
                <p className="mt-3 text-[14px] text-muted-foreground leading-relaxed">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
            {t("metricsNote")}
          </p>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <div className="max-w-2xl">
            <div className="eyebrow">{t("pubsEyebrow")}</div>
            <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
              {t("pubsTitle")}
            </h2>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {publications.map((p, i) => (
            <Reveal key={p.doi} delayMs={i * 70}>
              <article className="pub-card h-full rounded-2xl border border-hairline bg-white p-8">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-blue">{p.role}</div>
                <h3 className="mt-2 font-display text-[16.5px] font-semibold text-graphite leading-snug">{p.title}</h3>
                {p.venue && <div className="mt-2 text-[13.5px] text-muted-foreground">{p.venue}</div>}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-blue hover:underline"
                >
                  DOI: {p.doi} <ExternalLink size={12} />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
            {t("pubsNote")}
          </p>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
