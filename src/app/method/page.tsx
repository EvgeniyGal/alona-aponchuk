import type { Metadata } from "next";
import { PageHero, Section, CtaBand } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "My Method — Workflow Discovery to Controlled Pilot",
  description:
    "Seven structured consulting steps: workflow discovery, client journey mapping, CRM logic optimization, knowledge base structuring, RAG readiness, QA calibration, and controlled pilot support.",
  path: "/method",
  image: "/images/home-service-workflow-audit.webp",
  imageAlt: "Seven structured steps from discovery to controlled pilot",
});

const steps = [
  {
    title: "Workflow Discovery",
    body:
      "I begin with structured interviews with founders, operations, and front-desk staff. Together we document what actually happens today — including workarounds, shadow processes, and points of friction.",
  },
  {
    title: "Client Journey Mapping",
    body:
      "I map every touchpoint from first inquiry to repeat visit. Ownership, timing, and communication channel are made explicit for each step.",
  },
  {
    title: "CRM Logic Optimization",
    body:
      "I review statuses, pipelines, custom fields, handoffs, and automation triggers against the mapped journey, and recommend a simpler, more reliable model.",
  },
  {
    title: "Knowledge Base Structuring",
    body:
      "I organize approved answers, source documents, escalation rules, and out-of-scope topics into a retrievable, versioned knowledge base.",
  },
  {
    title: "RAG / Chatbot Readiness",
    body:
      "I define retrieval configuration, prompts, response scope, guardrails, and fallback paths so any AI-supported channel behaves predictably.",
  },
  {
    title: "QA & Behavioral Calibration",
    body:
      "I test automated responses against the Behavioral Calibration Framework — RSI (stability), IDS (interpretive drift), and RCS (response coherence and structure) — relative to defined policy and tone.",
  },
  {
    title: "Controlled Pilot Support",
    body:
      "I launch a bounded pilot with clear success criteria, monitoring, and human escalation. Expansion happens only after validated performance.",
  },
];

export default function MethodPage() {
  return (
    <>
      <PageHero
        eyebrow="My Method"
        title="Seven structured steps from discovery to controlled pilot."
        lead="Each step produces a specific artifact — a map, a document, a configuration, or a test result — that the next step depends on. Nothing is skipped for speed."
        image={{
          filename: "home-service-workflow-audit.webp",
          label: "Structured workflow discovery materials",
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
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Step</div>
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
