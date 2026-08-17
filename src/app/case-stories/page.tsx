import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageHero, Section } from "@/components/page-shell";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { translatedPageMetadata } from "@/i18n/page-metadata";

export async function generateMetadata() {
  return translatedPageMetadata({
    namespace: "caseStories",
    path: "/case-stories",
    image: "/images/home-case-integrative-health.webp",
  });
}

type ImageTone = "blue" | "teal" | "sage" | "gold" | "ivory";

type Story = {
  id: string;
  title: string;
  org: string;
  role: string;
  context: string;
  challenge: string;
  approach: string;
  systems: string;
  contribution: string[];
  outcome: string[];
  note: string;
  image: string;
  tone: ImageTone;
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wider text-blue">{children}</div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <p className="mt-3 text-[14.5px] text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export default async function CaseStoriesPage() {
  const t = await getTranslations("caseStories");
  const stories = t.raw("stories") as Story[];

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        image={{
          filename: "home-case-integrative-health.webp",
          label: t("imageLabel"),
          tone: "teal",
        }}
      />

      <Section>
        <div className="space-y-8">
          {stories.map((s, i) => (
            <Reveal key={s.id} delayMs={i * 60} variant="up">
              <article
                id={s.id}
                className="case-card overflow-hidden rounded-2xl border border-hairline bg-white"
              >
                <ImagePlaceholder
                  label={s.title}
                  filename={s.image}
                  aspect="wide"
                  tone={s.tone}
                  className="border-0 border-b rounded-none hidden md:block"
                />
                <div className="p-8 md:p-10">
                  <div className="flex flex-col gap-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-blue">
                      {s.org}
                    </div>
                    <h2 className="font-display text-2xl md:text-[26px] text-graphite leading-tight">
                      {s.title}
                    </h2>
                    <div className="text-[13.5px] text-muted-foreground">{t("role", { role: s.role })}</div>
                  </div>

                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <Field label={t("context")}>{s.context}</Field>
                    <Field label={t("challenge")}>{s.challenge}</Field>
                    <Field label={t("approach")}>{s.approach}</Field>
                    <Field label={t("systems")}>{s.systems}</Field>
                  </div>

                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <div>
                      <Label>{t("contribution")}</Label>
                      <ul className="mt-3 space-y-2 text-[14.5px] text-muted-foreground leading-relaxed">
                        {s.contribution.map((c) => (
                          <li key={c}>· {c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label>{t("outcome")}</Label>
                      <ul className="mt-3 space-y-2 text-[14.5px] text-graphite leading-relaxed">
                        {s.outcome.map((c) => (
                          <li key={c}>· {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-8 text-[12.5px] text-muted-foreground leading-relaxed border-t border-hairline pt-5">
                    <span className="font-medium text-graphite/70">{t("scopeNote")}</span>{" "}
                    {s.note}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
            {t("footerNote")}
          </p>
        </Reveal>

        <Reveal delayMs={60}>
          <div className="mt-10">
            <Link
              href="/contact"
              className="cta-shimmer inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-blue px-6 py-3 text-[14.5px] font-medium text-white hover:bg-blue/90"
            >
              {t("discussCta")} <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
