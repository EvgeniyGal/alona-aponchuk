import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, CtaBand } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";

export const metadata: Metadata = {
  title: "Case Stories — Selected Workflow Engagements",
  description:
    "Selected case stories from CRM, EHR, and workflow optimization engagements across integrative healthcare, educational research, and AI-supported digital systems.",
  openGraph: {
    title: "Selected Case Stories — Aponchuk Workflow Systems",
    description:
      "Structured workflow analysis applied to healthcare operations, educational research programs, and AI-supported digital platforms.",
    url: "/case-stories",
  },
  alternates: { canonical: "/case-stories" },
};

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
  tone: "blue" | "teal" | "sage" | "gold" | "ivory";
};

const stories: Story[] = [
  {
    id: "integrative-health",
    title: "CRM/EHR and Clinical Workflow Optimization for an Integrative Health Center",
    org: "U.S.-based integrative medical center",
    role: "CRM, EHR & Clinical Workflow Optimization Consultant",
    context:
      "The organization used digital systems for patient intake, appointment scheduling, clinical documentation, inventory management, staff coordination, and client communication.",
    challenge:
      "Operational information moved between physicians, clinical staff, and front-office roles through inconsistent paths, and clinical templates for IV therapies, injections, and laboratory procedures were not fully standardized.",
    approach:
      "Reviewed the CRM/EHR configuration end-to-end, standardized intake and clinical documentation, and aligned scheduling, inventory, and staff workflows with the actual client journey.",
    systems: "CharmHealth CRM/EHR, Blologic inventory management, patient intake forms, clinical templates, scheduling and communication tools.",
    contribution: [
      "Administered and optimized the CharmHealth CRM/EHR configuration.",
      "Developed and implemented patient intake forms and clinical documentation templates for IV therapy, IM injections, and laboratory procedures.",
      "Validated patient-management and appointment-scheduling workflows.",
      "Supported inventory and product-management processes in Blologic.",
      "Delivered staff training and implementation support.",
      "Provided ongoing website, digital communication, and operational-system support.",
    ],
    outcome: [
      "More standardized clinical and operational workflows.",
      "Improved coordination between physicians and clinical staff.",
      "Fewer workflow inconsistencies and less manual transfer of operational information.",
      "More centralized documentation and operational data.",
      "Improved inventory-process visibility and stronger operational reliability.",
    ],
    note: "Scope covers workflow, documentation, and system-configuration contributions. No clinical outcomes are claimed.",
    image: "home-case-integrative-health.webp",
    tone: "teal",
  },
  {
    id: "educational-research",
    title: "CRM and Registration Workflow Optimization for an Educational and Research Organization",
    org: "U.S.-based nonprofit educational and research organization",
    role: "CRM Systems and Workflow Optimization Specialist",
    context:
      "The organization runs educational and research programs, including international scientific conferences, that depend on reliable registration, participant management, and communication.",
    challenge:
      "Registration, participant, and speaker information flowed through several tools, producing inconsistent statuses, uneven communication, and reporting that was difficult to rely on.",
    approach:
      "Rebuilt CRM logic around the actual participant journey — forms, statuses, triggers, and communication touchpoints — and introduced clearer reporting and data-quality controls.",
    systems: "CRM administration, registration and participant-management systems, forms, statuses, triggers, and reporting logic.",
    contribution: [
      "Administered the CRM and optimized registration and participant-management workflows.",
      "Structured forms, statuses, triggers, and communication processes.",
      "Validated the participant journey and improved reporting logic.",
      "Introduced CRM data-quality controls.",
      "Supported digital workflows for international conference operations and speaker communications.",
    ],
    outcome: [
      "Stronger workflow consistency across programs and events.",
      "Clearer participant and speaker communication.",
      "Improved CRM data quality and more reliable reporting logic.",
      "Scalable digital support for educational, research, and event operations.",
    ],
    note: "Scope describes workflow and CRM contributions. No participant, revenue, or growth figures are claimed.",
    image: "home-case-educational-research.webp",
    tone: "blue",
  },
  {
    id: "ai-digital-systems",
    title: "QA and Workflow Validation for AI-Supported Digital Systems",
    org: "U.S.-based technology and digital-systems company",
    role: "AI and Digital Systems Subcontractor",
    context:
      "The company builds AI-oriented digital platforms, including knowledge-base-integrated environments and RAG-supported service workflows.",
    challenge:
      "AI-enabled workflows required careful validation of system logic, user journeys, and automation behavior before wider use.",
    approach:
      "Contributed to workflow design and testing across several AI-oriented systems, including the PersonaMatrix project, focusing on reliability and structured validation.",
    systems: "AI-oriented workflow design, automation processes, knowledge-base-integrated environments, RAG-supported service workflows.",
    contribution: [
      "Supported AI-oriented workflow design and system-logic validation.",
      "Tested digital platforms and automation processes for user-experience reliability.",
      "Contributed to improvements in educational-system workflows.",
      "Supported knowledge-base-integrated and RAG-supported workflows, including participation in the PersonaMatrix project.",
    ],
    outcome: [
      "Supported the reliability of AI-enabled workflows.",
      "Helped identify system-logic and user-journey issues.",
      "Strengthened QA and validation processes.",
      "Contributed to more structured automation environments.",
    ],
    note: "Contributions were collaborative. No product ownership or guaranteed performance is claimed.",
    image: "home-case-ai-digital-systems.webp",
    tone: "sage",
  },
];

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

export default function CaseStoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Stories"
        title="Selected professional contributions in CRM, workflow, and AI-supported systems."
        lead="Each case story describes a real engagement, anonymized where confidentiality applies. Structured to show context, approach, and practical contribution — not marketing outcomes."
        image={{
          filename: "home-case-integrative-health.webp",
          label: "Clinical workflow operations",
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
                    <div className="text-[13.5px] text-muted-foreground">My role: {s.role}</div>
                  </div>

                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <Field label="Context">{s.context}</Field>
                    <Field label="Operational Challenge">{s.challenge}</Field>
                    <Field label="Approach">{s.approach}</Field>
                    <Field label="Systems / Processes Involved">{s.systems}</Field>
                  </div>

                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <div>
                      <Label>Practical Contribution</Label>
                      <ul className="mt-3 space-y-2 text-[14.5px] text-muted-foreground leading-relaxed">
                        {s.contribution.map((c) => (
                          <li key={c}>· {c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label>Outcome</Label>
                      <ul className="mt-3 space-y-2 text-[14.5px] text-graphite leading-relaxed">
                        {s.outcome.map((c) => (
                          <li key={c}>· {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-8 text-[12.5px] text-muted-foreground leading-relaxed border-t border-hairline pt-5">
                    <span className="font-medium text-graphite/70">Scope & Confidentiality Note.</span>{" "}
                    {s.note}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
            Case stories describe selected professional contributions based on available project
            records. Certain identifying, technical, operational, or client-confidential details may
            be omitted or generalized.
          </p>
        </Reveal>

        <Reveal delayMs={60}>
          <div className="mt-10">
            <Link
              href="/contact"
              className="cta-shimmer inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-blue px-6 py-3 text-[14.5px] font-medium text-white hover:bg-blue/90"
            >
              Discuss Your Workflow <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
