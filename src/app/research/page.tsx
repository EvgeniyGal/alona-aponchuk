import type { Metadata } from "next";
import { PageHero, Section, CtaBand } from "@/components/page-shell";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";

export const metadata: Metadata = {
  title: "Research Basis — Quality Metrics for AI-Mediated Communication",
  description:
    "Applied research foundation for CRM workflow optimization and RAG-supported client communication, including RSI, IDS, and RCS quality metrics.",
  openGraph: {
    title: "Research Basis — Aponchuk Workflow Systems",
    description: "Applied research supporting reliable AI-mediated communication in healthcare and wellness workflows.",
    url: "/research",
  },
  alternates: { canonical: "/research" },
};

const layers = [
  { code: "01", title: "CRM", body: "System of record for the client relationship." },
  { code: "02", title: "Client Data", body: "Structured records, statuses, and history." },
  { code: "03", title: "Verified Knowledge Base", body: "Approved, versioned answers and sources." },
  { code: "04", title: "RAG Layer", body: "Retrieval-supported response generation." },
  { code: "05", title: "Communication Channels", body: "Email, SMS, chat, and staff handoff." },
  { code: "06", title: "QA Calibration", body: "Stability, drift, and calibration monitoring." },
];

const metrics = [
  {
    code: "RSI",
    name: "Response Stability Index",
    body: "Measures whether the same or rephrased question yields consistent, in-scope answers across repeated queries.",
  },
  {
    code: "IDS",
    name: "Interpretive Drift Score",
    body: "Measures how far generated responses drift from the approved knowledge base and defined response boundaries.",
  },
  {
    code: "RCS",
    name: "Response Coherence / Structure Score",
    body: "Measures structural coherence and alignment of tone, scope, refusal behavior, and escalation with the documented communication policy.",
  },
];

const publications = [
  {
    role: "Author",
    title:
      "RAG-Based Automation of the Client Journey in Medical and Wellness Systems: Operational Efficiency, Client Retention, and Behavioral Calibration of AI-Mediated Communication",
    doi: "10.69635/mssl.2026.2.2.45",
    url: "https://doi.org/10.69635/mssl.2026.2.2.45",
  },
  {
    role: "Co-Author",
    title:
      "Psychological Testing as an Instrument of Differentiated Support in Education, Healthcare Settings, and Crisis Life Transitions: Typological, Trait-Based, and Psychodynamic Approaches",
    venue: "Metaverse Science, Society and Law",
    doi: "10.69635/mssl.2026.2.2.38",
    url: "https://doi.org/10.69635/mssl.2026.2.2.38",
  },
];

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research Basis"
        title="Applied research supporting reliable AI-mediated communication."
        lead="My method draws on applied research into retrieval-supported communication, response stability, and interpretive drift. Metrics are used as calibration signals — not as guarantees of outcomes."
        image={{
          filename: "home-research-methodology.webp",
          label: "Research methodology materials",
          tone: "teal",
        }}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-end">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow">System View</div>
              <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
                The simplified system supporting responsible client communication.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Six connected layers — from the CRM system of record through QA calibration —
                form the operational backbone of reliable AI-mediated communication.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={80} className="hidden lg:block">
            <ImagePlaceholder
              label="Five-layer system diagram"
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
                <div className="text-[11px] font-semibold text-blue">Layer {l.code}</div>
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
                    <div className="text-[11px] font-semibold text-blue">Layer {l.code}</div>
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
            This diagram is a simplified reference model. Actual implementations vary by
            organization, data structure, tooling, and operational context.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <Reveal>
          <div className="max-w-2xl">
            <div className="eyebrow">Behavioral Calibration Framework</div>
            <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
              Three behavioral evaluation metrics for AI-mediated communication.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              RSI, IDS, and RCS are used together to assess and calibrate AI-supported responses
              against a verified knowledge base and defined communication policy.
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
            These metrics are used as internal calibration signals. They do not represent guaranteed
            performance and depend on the client&apos;s knowledge base, workflow scope, and operational context.
          </p>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <div className="max-w-2xl">
            <div className="eyebrow">Publications</div>
            <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
              Peer-reviewed research and professional contributions.
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
            Additional research activities include participation in the “Beyond Human: AI, Consciousness,
            Personality and the Future of Human Development” international scientific conference
            (September 2026) as Conference Operations & Digital Workflow Coordinator.
          </p>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
