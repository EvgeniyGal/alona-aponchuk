import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, CtaBand } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Services — Workflow Audit, Automation Readiness, Pilot Support",
  description:
    "Workflow Audit, Automation Readiness Package, Pilot Implementation Support, and a Monthly Optimization Retainer for healthcare and wellness organizations.",
  path: "/services",
  image: "/images/home-service-automation-readiness.webp",
  imageAlt: "Bounded consulting engagements for healthcare and wellness workflows",
});

const services = [
  {
    title: "Workflow Audit",
    who: "For founders, practice managers, and operations leaders who suspect that clients are getting lost between systems.",
    what:
      "A structured review of intake, CRM, scheduling, follow-up, and existing automation. Includes journey mapping, gap analysis, and prioritized recommendations.",
    outcome: "A documented view of where the client journey loses continuity — and where structured workflows can restore it.",
    image: "home-service-workflow-audit.webp",
    tone: "blue" as const,
  },
  {
    title: "Automation Readiness Package",
    who: "For organizations preparing to deploy chatbots, RAG assistants, or AI-supported communication.",
    what:
      "Knowledge-base structuring, response boundary definition, retrieval configuration review, and escalation-path design.",
    outcome: "A verified foundation that responsible AI-mediated communication can safely sit on top of.",
    image: "home-service-automation-readiness.webp",
    tone: "teal" as const,
  },
  {
    title: "Pilot Implementation Support",
    who: "For teams ready to launch a bounded pilot of an automated communication or workflow.",
    what:
      "Pilot scoping, QA test-set design, calibration reviews, and monitoring guidance during a controlled rollout.",
    outcome: "A pilot with defined success criteria, human escalation, and evidence-based decisions about expansion.",
    image: "home-service-pilot-implementation.webp",
    tone: "sage" as const,
  },
  {
    title: "Monthly Optimization Retainer",
    who: "For organizations with live automation who need ongoing calibration and continuity oversight.",
    what:
      "Recurring reviews of workflow performance, knowledge-base updates, QA re-testing, and refinement of response boundaries.",
    outcome: "Sustained reliability of AI-mediated communication and CRM workflows over time.",
    image: "home-service-optimization-retainer.webp",
    tone: "gold" as const,
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Bounded engagements, calibrated to your operational context."
        lead="Every engagement starts with a Workflow Audit. Pricing is scoped to the organization and shared during the diagnostic call — not published as a fixed catalog."
        image={{
          filename: "home-service-automation-readiness.webp",
          label: "Automation readiness workspace",
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
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-blue">Who it&apos;s for</dt>
                      <dd className="mt-1.5 text-muted-foreground leading-relaxed">{s.who}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-blue">What&apos;s included</dt>
                      <dd className="mt-1.5 text-muted-foreground leading-relaxed">{s.what}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-blue">Outcome</dt>
                      <dd className="mt-1.5 text-graphite leading-relaxed">{s.outcome}</dd>
                    </div>
                  </dl>
                  <Link
                    href="/contact"
                    className="mt-8 inline-flex items-center gap-1.5 text-blue font-medium hover:underline text-[14px]"
                  >
                    Request Workflow Audit <ArrowRight size={14} />
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
