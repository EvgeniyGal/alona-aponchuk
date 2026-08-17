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
    namespace: "servicesPage",
    path: "/services",
    image: "/images/home-service-automation-readiness.webp",
  });
}

type ImageTone = "blue" | "teal" | "sage" | "gold" | "ivory";

export default async function ServicesPage() {
  const t = await getTranslations("servicesPage");
  const common = await getTranslations("common");
  const services = t.raw("items") as Array<{
    title: string;
    who: string;
    what: string;
    outcome: string;
    image: string;
    tone: ImageTone;
  }>;

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        image={{
          filename: "home-service-automation-readiness.webp",
          label: t("imageLabel"),
          tone: "teal",
        }}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {services.map((s, i) => (
            <Reveal key={s.title} delayMs={i * 70} variant="up">
              <article className="service-card h-full overflow-hidden rounded-2xl border border-hairline bg-white flex flex-col min-h-[440px]">
                <ImagePlaceholder
                  label={s.title}
                  filename={s.image}
                  aspect="landscape"
                  tone={s.tone}
                  className="border-0 border-b rounded-none hidden sm:block"
                />
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <h2 className="font-display text-2xl md:text-[26px] text-graphite">{s.title}</h2>
                  <dl className="mt-6 space-y-5 text-[14.5px] flex-1">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-blue">{t("who")}</dt>
                      <dd className="mt-1.5 text-muted-foreground leading-relaxed">{s.who}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-blue">{t("what")}</dt>
                      <dd className="mt-1.5 text-muted-foreground leading-relaxed">{s.what}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-blue">{t("outcome")}</dt>
                      <dd className="mt-1.5 text-graphite leading-relaxed">{s.outcome}</dd>
                    </div>
                  </dl>
                  <Link
                    href="/contact"
                    className="mt-8 inline-flex items-center gap-1.5 text-blue font-medium hover:underline text-[14px]"
                  >
                    {common("requestAudit")} <ArrowRight size={14} />
                  </Link>
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
