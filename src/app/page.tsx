import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  CheckCircle2,
  Layers,
  BookOpen,
  Bot,
  ShieldCheck,
  Workflow,
  ExternalLink,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { JourneyDiagram } from "@/components/journey-diagram";
import { CtaBand } from "@/components/cta-band";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { ContinuityReveal } from "@/components/continuity-reveal";
import { Reveal } from "@/components/reveal";
import { MetricPulse } from "@/components/metric-pulse";
import { HeroAtmosphere } from "@/components/hero-atmosphere";
import { translatedPageMetadata } from "@/i18n/page-metadata";

export async function generateMetadata() {
  return translatedPageMetadata({
    namespace: "home",
    path: "/",
    absoluteTitle: true,
    image: "/images/home-hero-operations.webp",
  });
}

const layerIcons = [Workflow, Layers, BookOpen, Bot, ShieldCheck];

type ImageTone = "blue" | "teal" | "sage" | "gold" | "ivory";

export default async function HomePage() {
  const t = await getTranslations("home");
  const common = await getTranslations("common");

  const heroPoints = t.raw("heroPoints") as string[];
  const comparison = t.raw("comparison") as Array<{ today: string; after: string }>;
  const layers = t.raw("layers") as Array<{ title: string; body: string }>;
  const services = t.raw("services") as Array<{
    title: string;
    body: string;
    image: string;
    tone: ImageTone;
  }>;
  const caseStories = t.raw("cases") as Array<{
    id: string;
    title: string;
    org: string;
    challenge: string;
    approach: string;
    outcome: string;
    image: string;
    tone: ImageTone;
  }>;
  const metrics = t.raw("metrics") as Array<{ from: string; to: string; label: string }>;
  const publications = t.raw("publications") as Array<{
    role: string;
    year: string;
    title: string;
    summary: string;
    url: string;
    doi: string;
    venue?: string;
  }>;

  return (
    <>
      {/* HERO — full-bleed visual plane + brand composition */}
      <section className="relative overflow-hidden border-b border-hairline hero-atmosphere">
        <HeroAtmosphere />

        <div className="relative z-10 container-page py-16 md:py-24 lg:py-28 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <Reveal variant="up" className="w-full min-w-0">
            <div className="eyebrow">{t("heroEyebrow")}</div>
            <h1 className="mt-5 font-display text-[40px] sm:text-[44px] md:text-[64px] leading-[1.03] font-semibold text-graphite tracking-tight">
              {t("heroTitle")}
            </h1>
            <p className="mt-7 text-lg text-muted-foreground w-full max-w-none lg:max-w-xl leading-relaxed">
              {t("heroLead")}
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3 w-full max-w-none lg:max-w-xl">
              {heroPoints.map((v) => (
                <li key={v} className="flex items-start gap-2.5 text-[14.5px] text-graphite">
                  <CheckCircle2 size={18} className="mt-0.5 text-teal shrink-0" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 w-full">
              <Link
                href="/contact"
                className="cta-shimmer inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-blue px-6 py-3.5 text-[14.5px] font-medium text-white hover:bg-blue/90 transition-colors"
              >
                {common("requestAudit")} <ArrowRight size={16} />
              </Link>
              <Link
                href="/method"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-hairline bg-white/90 px-6 py-3.5 text-[14.5px] font-medium text-graphite hover:bg-muted transition-colors backdrop-blur-sm"
              >
                {common("exploreMethod")}
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[13px] text-muted-foreground">
              <MapPin size={14} className="text-blue" />
              {t("locationLine")}
            </div>
          </Reveal>

          <Reveal variant="right" delayMs={120} className="relative z-20 w-full min-w-0 lg:justify-self-end lg:max-w-md">
            <JourneyDiagram />
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 bg-white border-b border-hairline overflow-hidden">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.05fr] items-center">
          <Reveal variant="left">
            <div className="eyebrow">{t("missionEyebrow")}</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
              {t("missionTitle")}
            </h2>
            <div className="mt-6 text-[16px] text-muted-foreground leading-relaxed space-y-5">
              <p>{t("missionBody")}</p>
              <Link href="/mission" className="inline-flex items-center gap-1.5 text-blue font-medium hover:underline">
                {t("missionCta")} <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
          <Reveal variant="right" delayMs={100}>
            <ImagePlaceholder
              label={t("missionImage")}
              filename="home-mission-continuum.webp"
              aspect="landscape"
              tone="sage"
              className="rounded-2xl shadow-[0_24px_50px_-36px_rgba(31,41,51,0.4)]"
            />
          </Reveal>
        </div>
      </section>

      {/* TODAY / AFTER + VIRAL CONTINUITY REVEAL */}
      <section className="py-20 relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-teal-soft/30 to-transparent"
          aria-hidden
        />
        <div className="container-page relative">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow">{t("todayEyebrow")}</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                {t("todayTitle")}
              </h2>
            </div>
          </Reveal>

          <Reveal delayMs={80} className="mt-12">
            <ContinuityReveal rows={comparison} />
          </Reveal>

          <Reveal delayMs={140}>
            <p className="mt-6 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
              {t("todayNote")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FIVE LAYERS */}
      <section className="py-20 bg-white border-y border-hairline">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-end">
            <Reveal>
              <div className="max-w-2xl">
                <div className="eyebrow">{t("layersEyebrow")}</div>
                <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                  {t("layersTitle")}
                </h2>
              </div>
            </Reveal>
            <Reveal delayMs={80} variant="fade">
              <ImagePlaceholder
                label={t("layersImage")}
                filename="home-five-layer-system.webp"
                aspect="wide"
                tone="blue"
                className="rounded-xl"
              />
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
            {layers.map(({ title, body }, i) => {
              const Icon = layerIcons[i] ?? Workflow;
              return (
                <Reveal key={title} delayMs={i * 70} variant="up">
                  <div className="layer-card h-full rounded-xl border border-hairline p-6 bg-ivory/60">
                    <div className="text-[11px] font-semibold text-blue">0{i + 1}</div>
                    <div className="layer-icon mt-3 flex h-10 w-10 items-center justify-center rounded-md bg-blue text-white">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-5 font-display text-[15.5px] font-semibold text-graphite">{title}</h3>
                    <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow">{t("servicesEyebrow")}</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                {t("servicesTitle")}
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delayMs={i * 70}>
                <div className="service-card h-full overflow-hidden rounded-xl border border-hairline bg-white flex flex-col">
                  <ImagePlaceholder
                    label={s.title}
                    filename={s.image}
                    aspect="landscape"
                    tone={s.tone}
                    className="border-0 border-b rounded-none"
                  />
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="font-display text-[17px] font-semibold text-graphite">{s.title}</h3>
                    <p className="mt-3 text-[13.5px] text-muted-foreground leading-relaxed flex-1">{s.body}</p>
                    <Link
                      href="/services"
                      className="mt-5 inline-flex items-center gap-1.5 text-blue text-[13.5px] font-medium hover:underline"
                    >
                      {t("learnMoreAbout", { title: s.title })} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT FEEDBACK */}
      <section className="py-20 bg-white border-y border-hairline">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow">{t("feedbackEyebrow")}</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                {t("feedbackTitle")}
              </h2>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-dashed border-hairline bg-ivory/50">
              <ImagePlaceholder
                label={t("feedbackImage")}
                filename="home-client-feedback.webp"
                aspect="wide"
                tone="ivory"
                className="border-0 rounded-none opacity-80"
              />
              <div className="p-10 text-center border-t border-hairline">
                <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  {t("feedbackBody")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CASE STORIES */}
      <section className="py-20">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow">{t("casesEyebrow")}</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                {t("casesTitle")}
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {caseStories.map((c, i) => (
              <Reveal key={c.id} delayMs={i * 80}>
                <article className="case-card h-full overflow-hidden rounded-2xl border border-hairline bg-white flex flex-col">
                  <ImagePlaceholder
                    label={c.title}
                    filename={c.image}
                    aspect="landscape"
                    tone={c.tone}
                    className="border-0 border-b rounded-none"
                  />
                  <div className="p-7 flex flex-col flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-blue">{c.org}</div>
                    <h3 className="mt-2 font-display text-[17px] font-semibold text-graphite leading-snug">
                      {c.title}
                    </h3>
                    <dl className="mt-5 space-y-4 text-[13.5px] flex-1">
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("challenge")}</dt>
                        <dd className="mt-1 text-muted-foreground leading-relaxed">{c.challenge}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("approach")}</dt>
                        <dd className="mt-1 text-muted-foreground leading-relaxed">{c.approach}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("outcome")}</dt>
                        <dd className="mt-1 text-graphite leading-relaxed">{c.outcome}</dd>
                      </div>
                    </dl>
                    <Link
                      href={`/case-stories#${c.id}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-blue text-[13.5px] font-medium hover:underline"
                    >
                      {t("readCase")} <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
              {t("casesNote")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* RESEARCH / METRICS */}
      <section className="py-20 bg-white border-y border-hairline">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <Reveal>
              <div className="max-w-2xl">
                <div className="eyebrow">{t("researchEyebrow")}</div>
                <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                  {t("researchTitle")}
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  {t("researchBody")}
                </p>
              </div>
            </Reveal>
            <Reveal variant="right" delayMs={90}>
              <ImagePlaceholder
                label={t("researchImage")}
                filename="home-research-methodology.webp"
                aspect="landscape"
                tone="teal"
                className="rounded-2xl"
              />
            </Reveal>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <MetricPulse key={m.label} {...m} delayMs={i * 90} />
            ))}
          </div>

          <Reveal>
            <p className="mt-6 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
              {t("metricsNote")}
            </p>
          </Reveal>

          <div className="mt-16">
            <Reveal>
              <div className="max-w-2xl">
                <div className="eyebrow">{t("pubsEyebrow")}</div>
                <h3 className="mt-3 font-display text-2xl md:text-3xl text-graphite leading-tight">
                  {t("pubsTitle")}
                </h3>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {publications.map((p, i) => (
                <Reveal key={p.doi} delayMs={i * 80}>
                  <article className="pub-card h-full rounded-2xl border border-hairline bg-white p-7 flex flex-col">
                    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider">
                      <span className="text-blue">{p.role}</span>
                      <span className="text-muted-foreground">· {p.year}</span>
                    </div>
                    <h4 className="mt-3 font-display text-[16.5px] font-semibold text-graphite leading-snug">
                      {p.title}
                    </h4>
                    {p.venue && (
                      <div className="mt-2 text-[13px] text-muted-foreground">{p.venue}</div>
                    )}
                    <p className="mt-4 text-[13.5px] text-muted-foreground leading-relaxed flex-1">
                      {p.summary}
                    </p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("readPublicationAria", { title: p.title })}
                      className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-blue hover:underline"
                    >
                      {t("readPublication")} <ExternalLink size={12} aria-hidden />
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-8">
                <Link href="/research" className="inline-flex items-center gap-1.5 text-blue font-medium hover:underline">
                  {t("exploreResearch")} <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <Reveal variant="left" className="hidden lg:block">
            <ImagePlaceholder
              label={t("aboutImage")}
              filename="home-about-workspace.webp"
              aspect="portrait"
              tone="sage"
              className="rounded-2xl max-w-md mx-auto lg:mx-0 shadow-[0_24px_50px_-36px_rgba(31,41,51,0.4)]"
            />
          </Reveal>
          <Reveal variant="right" delayMs={80}>
            <div>
              <div className="eyebrow">{t("aboutEyebrow")}</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                {t("aboutTitle")}
              </h2>
            </div>
            <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
              <p>{t("aboutP1")}</p>
              <p>{t("aboutP2")}</p>
              <Link href="/about" className="inline-flex items-center gap-1.5 text-blue font-medium hover:underline">
                {t("aboutCta")} <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
