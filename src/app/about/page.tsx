import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Linkedin, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/page-shell";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { translatedPageMetadata } from "@/i18n/page-metadata";

export async function generateMetadata() {
  return translatedPageMetadata({
    namespace: "about",
    path: "/about",
    image: "/alona-portrait.webp",
  });
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="service-card h-full rounded-2xl border border-hairline bg-white p-8">
      <h2 className="font-display text-xl md:text-2xl text-graphite">{title}</h2>
      <div className="mt-5 text-[15px] text-muted-foreground leading-relaxed space-y-4">
        {children}
      </div>
    </article>
  );
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const common = await getTranslations("common");
  const expertise = t.raw("expertise") as string[];
  const experience = t.raw("experience") as Array<{
    dates: string;
    role: string;
    org: string;
    location: string;
    body: string;
  }>;
  const education = t.raw("education") as Array<{
    degree: string;
    school: string;
    dates: string;
    location: string;
  }>;
  const publications = t.raw("publications") as Array<{
    role: string;
    title: string;
    doi: string;
    url: string;
    venue?: string;
  }>;

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 0% 0%, rgba(156,175,159,0.18), transparent 55%), radial-gradient(ellipse 40% 40% at 100% 100%, rgba(79,157,166,0.12), transparent 50%)",
          }}
        />
        <div className="relative container-page py-16 md:py-24 grid gap-12 lg:grid-cols-[1fr_1.4fr] items-center">
          <Reveal variant="left" className="order-2 lg:order-1">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-3 rounded-2xl bg-sage-soft/40 -z-10" aria-hidden />
              <Image
                src="/alona-portrait.webp"
                alt={t("seo.imageAlt")}
                width={480}
                height={480}
                className="w-full aspect-square object-cover rounded-2xl border border-hairline shadow-sm"
                priority
              />
            </div>
          </Reveal>
          <Reveal variant="right" delayMs={80} className="order-1 lg:order-2 w-full min-w-0">
            <div className="eyebrow">{t("eyebrow")}</div>
            <h1 className="mt-4 font-display text-[36px] md:text-5xl font-semibold text-graphite leading-[1.1]">
              {t("name")}
            </h1>
            <p className="mt-3 font-display text-lg text-graphite/80">
              {t("role")}
            </p>
            <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed w-full max-w-none lg:max-w-xl">
              {t("lead")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-blue" /> {t("location")}</span>
              <a href="mailto:info@aponchukworkflow.com" className="inline-flex items-center gap-1.5 hover:text-blue">
                <Mail size={14} /> info@aponchukworkflow.com
              </a>
              <a
                href="https://www.linkedin.com/in/alona-aponchuk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue"
              >
                <Linkedin size={14} /> {t("linkedin")}
              </a>
              <span className="text-muted-foreground/80">{t("orcid")}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal variant="up">
            <SectionCard title={t("introTitle")}>
              <p>{t("introP1")}</p>
              <p>{t("introP2")}</p>
            </SectionCard>
          </Reveal>

          <Reveal variant="up" delayMs={80}>
            <SectionCard title={t("backgroundTitle")}>
              <p>{t("backgroundP1")}</p>
              <p>{t("backgroundP2")}</p>
            </SectionCard>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <Reveal>
          <div className="max-w-2xl">
            <div className="eyebrow">{t("expertiseEyebrow")}</div>
            <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
              {t("expertiseTitle")}
            </h2>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((item, i) => (
            <Reveal key={item} delayMs={(i % 6) * 40} variant="up">
              <div className="layer-card rounded-lg border border-hairline bg-ivory/60 px-4 py-3 text-[14px] text-graphite">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <div className="max-w-2xl">
            <div className="eyebrow">{t("experienceEyebrow")}</div>
            <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
              {t("experienceTitle")}
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 space-y-6">
          {experience.map((e, i) => (
            <Reveal key={`${e.role}-${e.dates}`} delayMs={Math.min(i * 40, 200)} variant="up">
              <article className="case-card rounded-2xl border border-hairline bg-white p-7 md:p-8">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg md:text-xl text-graphite">{e.role}</h3>
                    <div className="mt-1 text-[14px] text-graphite/80">{e.org}</div>
                  </div>
                  <div className="text-[12.5px] text-muted-foreground shrink-0">
                    <div className="font-medium text-graphite/70">{e.dates}</div>
                    <div>{e.location}</div>
                  </div>
                </div>
                <p className="mt-4 text-[14.5px] text-muted-foreground leading-relaxed">{e.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] items-start">
          <Reveal>
            <div>
              <div className="eyebrow">{t("educationEyebrow")}</div>
              <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
                {t("educationTitle")}
              </h2>
            </div>
          </Reveal>
          <div className="space-y-5">
            {education.map((ed, i) => (
              <Reveal key={ed.degree} delayMs={i * 70}>
                <div className="service-card rounded-xl border border-hairline bg-white p-6">
                  <div className="font-display text-[16px] font-semibold text-graphite">{ed.degree}</div>
                  <div className="mt-1 text-[14px] text-graphite/80">{ed.school}</div>
                  <div className="mt-1 text-[13px] text-muted-foreground">{ed.dates} · {ed.location}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal variant="up">
            <SectionCard title={t("focusTitle")}>
              <p>{t("focusP1")}</p>
              <p>{t("focusP2")}</p>
            </SectionCard>
          </Reveal>

          <Reveal variant="up" delayMs={80}>
            <SectionCard title={t("philosophyTitle")}>
              <p>{t("philosophyP1")}</p>
              <p>{t("philosophyP2")}</p>
            </SectionCard>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <Reveal>
          <div className="max-w-2xl">
            <div className="eyebrow">{t("pubsEyebrow")}</div>
            <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
              {t("pubsTitle")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("pubsLead")}
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {publications.map((p, i) => (
            <Reveal key={p.doi} delayMs={i * 70}>
              <article className="pub-card h-full rounded-xl border border-hairline bg-white p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-blue">{p.role}</div>
                <h3 className="mt-2 font-display text-[16px] font-semibold text-graphite leading-snug">{p.title}</h3>
                {p.venue && <div className="mt-2 text-[13.5px] text-muted-foreground">{p.venue}</div>}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-blue hover:underline"
                >
                  DOI: {p.doi} <ExternalLink size={12} />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
            {t("pubsNote")}
          </p>
        </Reveal>
      </Section>

      <div className="container-page pb-4 pt-2">
        <Reveal>
          <div className="rounded-2xl border border-hairline bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-[14.5px] text-muted-foreground leading-relaxed md:flex-1">
              {t("bandBody")}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
              <Link
                href="/contact"
                className="cta-shimmer inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-blue px-5 py-3 text-[14px] font-medium text-white hover:bg-blue/90"
              >
                {common("requestAudit")}
              </Link>
              <Link
                href="/method"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-hairline bg-white px-5 py-3 text-[14px] font-medium text-graphite hover:bg-muted"
              >
                {common("exploreMethod")}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <CtaBand />
    </>
  );
}
