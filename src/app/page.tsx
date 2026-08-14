import type { Metadata } from "next";
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
import { JourneyDiagram } from "@/components/journey-diagram";
import { CtaBand } from "@/components/page-shell";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { ContinuityReveal } from "@/components/continuity-reveal";
import { Reveal } from "@/components/reveal";
import { MetricPulse } from "@/components/metric-pulse";

export const metadata: Metadata = {
  title: {
    absolute: "Alona Aponchuk — CRM Workflow & Client Journey Consulting for Healthcare & Wellness",
  },
  description:
    "I help healthcare and wellness organizations build reliable digital workflows: CRM optimization, client journey design, QA-validated communication, and RAG-ready automation. Sarasota, Florida — remote consulting across the United States.",
  openGraph: {
    title: "Alona Aponchuk — Reliable Workflows. Better Client Journeys. Responsible AI.",
    description:
      "Executive workflow consulting for healthcare and wellness organizations. CRM, client journeys, QA validation, and responsible AI.",
    url: "/",
    type: "website",
  },
  alternates: { canonical: "/" },
};

const comparison = [
  {
    today: "Staff manually answer the same routine questions every day.",
    after: "Approved automated responses handle routine questions within defined boundaries.",
  },
  {
    today: "Clients submit a form and hear nothing.",
    after: "Structured follow-up reminds, confirms, and prepares the client for the next step.",
  },
  {
    today: "Approximately 40 minutes to process one client.",
    after: "A modeled workflow may reduce this to approximately 15 minutes.",
  },
  {
    today: "Approximately 40 hours across six staff for 60 clients.",
    after: "A modeled workflow may reduce this to approximately 15 hours.",
  },
  {
    today: "Clients drop off because no one responds in time.",
    after: "A structured process supports continuity at every stage.",
  },
];

const layers = [
  { icon: Workflow, title: "Client Journey Mapping", body: "Document every touchpoint from first contact through repeat visit." },
  { icon: Layers, title: "CRM Workflow Optimization", body: "Clarify statuses, ownership, handoffs, and automation triggers." },
  { icon: BookOpen, title: "Verified Knowledge Base", body: "Structure approved answers, sources, and response boundaries." },
  { icon: Bot, title: "RAG / Chatbot Readiness", body: "Prepare content, retrieval, and guardrails for reliable automation." },
  { icon: ShieldCheck, title: "QA & Behavioral Calibration", body: "Behavioral Calibration Framework — RSI, IDS, and RCS — applied before launch." },
];

const services = [
  {
    title: "Workflow Audit",
    body: "Structured review of intake, CRM, scheduling, follow-up, and existing automation.",
    image: "home-service-workflow-audit.webp",
    tone: "blue" as const,
  },
  {
    title: "Automation Readiness",
    body: "Knowledge base, retrieval structure, and response boundaries prepared for AI.",
    image: "home-service-automation-readiness.webp",
    tone: "teal" as const,
  },
  {
    title: "Pilot Implementation",
    body: "Guided pilot of a bounded, QA-validated communication workflow.",
    image: "home-service-pilot-implementation.webp",
    tone: "sage" as const,
  },
  {
    title: "Optimization Retainer",
    body: "Ongoing workflow calibration, monitoring, and refinement.",
    image: "home-service-optimization-retainer.webp",
    tone: "gold" as const,
  },
];

const caseStories = [
  {
    id: "integrative-health",
    title: "CRM/EHR & Clinical Workflow Optimization",
    org: "U.S.-based integrative medical center",
    challenge: "Clinical documentation and operational data moved between roles through inconsistent paths.",
    approach: "Standardized CharmHealth CRM/EHR configuration, intake forms, and clinical templates alongside inventory workflows.",
    outcome: "More standardized workflows, improved physician–staff coordination, and stronger operational reliability.",
    image: "home-case-integrative-health.webp",
    tone: "teal" as const,
  },
  {
    id: "educational-research",
    title: "CRM & Registration Workflow Optimization",
    org: "U.S.-based educational and research organization",
    challenge: "Participant, registration, and reporting data were fragmented across tools and hard to rely on.",
    approach: "Rebuilt CRM logic around the participant journey with clearer forms, statuses, triggers, and reporting.",
    outcome: "Stronger workflow consistency and more reliable reporting across programs and international events.",
    image: "home-case-educational-research.webp",
    tone: "blue" as const,
  },
  {
    id: "ai-digital-systems",
    title: "QA & Workflow Validation for AI-Supported Systems",
    org: "U.S.-based technology and digital-systems company",
    challenge: "AI-enabled workflows required structured validation of system logic and user journeys.",
    approach: "Contributed to workflow design and testing across AI-oriented platforms, including the PersonaMatrix project.",
    outcome: "Supported the reliability of AI-enabled workflows and strengthened QA and validation processes.",
    image: "home-case-ai-digital-systems.webp",
    tone: "sage" as const,
  },
];

const metrics = [
  { from: "~40 min", to: "~15 min", label: "Per-client workflow time" },
  { from: "~40 hrs", to: "~15 hrs", label: "For 60 clients" },
  { from: "~6.6 hrs", to: "~2.5 hrs", label: "Per employee" },
  { from: "$83", to: "$66", label: "Modeled CAC" },
];

const publications = [
  {
    role: "Author",
    year: "2026",
    title:
      "RAG-Based Automation of the Client Journey in Medical and Wellness Systems: Operational Efficiency, Client Retention, and Behavioral Calibration of AI-Mediated Communication",
    summary:
      "Examines how CRM systems, verified knowledge bases, RAG-supported communication, and QA calibration can support more reliable client journeys — while maintaining clear human-review and responsible AI boundaries.",
    url: "https://doi.org/10.69635/mssl.2026.2.2.45",
    doi: "10.69635/mssl.2026.2.2.45",
  },
  {
    role: "Co-Author",
    year: "2026",
    title:
      "Psychological Testing as an Instrument of Differentiated Support in Education, Healthcare Settings, and Crisis Life Transitions: Typological, Trait-Based, and Psychodynamic Approaches",
    summary:
      "Explores differentiated support approaches across education, healthcare, and crisis-related life transitions — part of the broader research context of structured, human-centered support systems.",
    url: "https://doi.org/10.69635/mssl.2026.2.2.38",
    doi: "10.69635/mssl.2026.2.2.38",
    venue: "Metaverse Science, Society and Law",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO — full-bleed visual plane + brand composition */}
      <section className="relative overflow-hidden border-b border-hairline hero-atmosphere">
        {/* Atmosphere only — no labels (prevents peeking under Journey card) */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-y-0 right-0 w-full lg:w-[52%]">
            <ImagePlaceholder
              label="Hero: calm clinical operations atmosphere"
              filename="home-hero-operations.webp"
              aspect="fill"
              tone="teal"
              silent
              priority
              className="border-0 rounded-none"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/55 lg:to-white/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-white/50" />
        </div>

        <div className="relative z-10 container-page py-16 md:py-24 lg:py-28 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <Reveal variant="up">
            <div className="hero-brand-mark mb-5 inline-flex items-center gap-3 rounded-md border border-hairline bg-white/80 px-3 py-2 backdrop-blur-sm">
              <span className="font-display text-[15px] font-semibold text-graphite">Alona Aponchuk</span>
              <span className="h-4 w-px bg-hairline" aria-hidden />
              <span className="text-[11.5px] text-muted-foreground">Aponchuk Workflow Systems LLC</span>
            </div>
            <div className="eyebrow">Reliable Workflows · Better Client Journeys · Responsible AI</div>
            <h1 className="mt-5 font-display text-[40px] sm:text-[44px] md:text-[64px] leading-[1.03] font-semibold text-graphite tracking-tight">
              Client Journey Automation for Healthcare & Wellness Organizations
            </h1>
            <p className="mt-7 text-lg text-muted-foreground max-w-xl leading-relaxed">
              I help healthcare and wellness organizations build reliable digital workflows —
              CRM, scheduling, follow-up, and responsible AI-supported communication.
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-xl">
              {[
                "Reliable intake and follow-up",
                "Clearer CRM and scheduling logic",
                "Structured knowledge for automation",
                "QA-validated client communication",
              ].map((v) => (
                <li key={v} className="flex items-start gap-2.5 text-[14.5px] text-graphite">
                  <CheckCircle2 size={18} className="mt-0.5 text-teal shrink-0" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="cta-shimmer inline-flex items-center gap-2 rounded-md bg-blue px-6 py-3.5 text-[14.5px] font-medium text-white hover:bg-blue/90 transition-colors"
              >
                Request Workflow Audit <ArrowRight size={16} />
              </Link>
              <Link
                href="/method"
                className="inline-flex items-center gap-2 rounded-md border border-hairline bg-white/90 px-6 py-3.5 text-[14.5px] font-medium text-graphite hover:bg-muted transition-colors backdrop-blur-sm"
              >
                Explore My Method
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[13px] text-muted-foreground">
              <MapPin size={14} className="text-blue" />
              Sarasota, Florida. Remote consulting across the United States.
            </div>
          </Reveal>

          <Reveal variant="right" delayMs={120} className="relative z-20 lg:justify-self-end w-full max-w-md">
            <JourneyDiagram />
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 bg-white border-b border-hairline overflow-hidden">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.05fr] items-center">
          <Reveal variant="left">
            <div className="eyebrow">Mission</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
              Reliable Digital Workflows for Human-Centered Care
            </h2>
            <div className="mt-6 text-[16px] text-muted-foreground leading-relaxed space-y-5">
              <p>
                The client journey is one connected operational system. When each layer is documented,
                validated, and calibrated, technology stops interrupting care and starts supporting it.
              </p>
              <Link href="/mission" className="inline-flex items-center gap-1.5 text-blue font-medium hover:underline">
                Read the full mission <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
          <Reveal variant="right" delayMs={100}>
            <ImagePlaceholder
              label="Mission: connected care continuum"
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
              <div className="eyebrow">Today vs. After Implementation</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                What changes when workflows are documented, structured, and QA-validated.
              </h2>
            </div>
          </Reveal>

          <Reveal delayMs={80} className="mt-12">
            <ContinuityReveal rows={comparison} />
          </Reveal>

          <Reveal delayMs={140}>
            <p className="mt-6 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
              Research-based modeled indicators, not guaranteed results. Actual outcomes depend on
              CRM configuration, data quality, staff processes, implementation scope, and adoption.
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
                <div className="eyebrow">The Five-Layer Solution</div>
                <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                  AI is one layer of a broader, reliable workflow system.
                </h2>
              </div>
            </Reveal>
            <Reveal delayMs={80} variant="fade">
              <ImagePlaceholder
                label="Five-layer workflow system diagram"
                filename="home-five-layer-system.webp"
                aspect="wide"
                tone="blue"
                className="rounded-xl"
              />
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
            {layers.map(({ icon: Icon, title, body }, i) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow">Services</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                Bounded engagements, calibrated to your operational context.
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
                    <Link href="/services" className="mt-5 inline-flex items-center gap-1.5 text-blue text-[13.5px] font-medium hover:underline">
                      Learn more <ArrowRight size={13} />
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
              <div className="eyebrow">Client Feedback</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                What collaborators and organizations say about working with me.
              </h2>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-dashed border-hairline bg-ivory/50">
              <ImagePlaceholder
                label="Client collaboration atmosphere"
                filename="home-client-feedback.webp"
                aspect="wide"
                tone="ivory"
                className="border-0 rounded-none opacity-80"
              />
              <div className="p-10 text-center border-t border-hairline">
                <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  Client feedback will be added following publication approval. Testimonials are
                  published only after written consent from the person and organization involved.
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
              <div className="eyebrow">Selected Case Stories</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                How structured workflow analysis translates into practical operational improvements.
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
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Challenge</dt>
                        <dd className="mt-1 text-muted-foreground leading-relaxed">{c.challenge}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Approach</dt>
                        <dd className="mt-1 text-muted-foreground leading-relaxed">{c.approach}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Outcome</dt>
                        <dd className="mt-1 text-graphite leading-relaxed">{c.outcome}</dd>
                      </div>
                    </dl>
                    <Link
                      href={`/case-stories#${c.id}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-blue text-[13.5px] font-medium hover:underline"
                    >
                      Read Case Story <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
              Case stories describe selected professional contributions based on available project
              records. Certain identifying, technical, operational, or client-confidential details
              may be omitted or generalized.
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
                <div className="eyebrow">Research-Based Process Effectiveness</div>
                <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                  Evidence behind my workflow methodology.
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  My consulting framework is informed by applied research in CRM workflow optimization,
                  healthcare and wellness operations, RAG architectures, QA validation, and responsible
                  AI-mediated communication.
                </p>
              </div>
            </Reveal>
            <Reveal variant="right" delayMs={90}>
              <ImagePlaceholder
                label="Research methodology visual"
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
              These figures are research-based modeled indicators, not guaranteed client results.
              Actual outcomes depend on CRM configuration, data quality, staff processes,
              implementation scope, organizational context, and adoption.
            </p>
          </Reveal>

          <div className="mt-16">
            <Reveal>
              <div className="max-w-2xl">
                <div className="eyebrow">Featured Publications</div>
                <h3 className="mt-3 font-display text-2xl md:text-3xl text-graphite leading-tight">
                  Peer-reviewed research supporting the methodology.
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
                      aria-label={`Read publication (opens in new tab): ${p.title}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-blue hover:underline"
                    >
                      Read Publication <ExternalLink size={12} aria-hidden />
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-8">
                <Link href="/research" className="inline-flex items-center gap-1.5 text-blue font-medium hover:underline">
                  Explore the Research Basis <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <Reveal variant="left">
            <ImagePlaceholder
              label="About atmosphere: consulting workspace"
              filename="home-about-workspace.webp"
              aspect="portrait"
              tone="sage"
              className="rounded-2xl max-w-md mx-auto lg:mx-0 shadow-[0_24px_50px_-36px_rgba(31,41,51,0.4)]"
            />
          </Reveal>
          <Reveal variant="right" delayMs={80}>
            <div>
              <div className="eyebrow">About Me</div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-graphite leading-tight">
                Applied specialist in CRM, patient management, and digital workflow systems.
              </h2>
            </div>
            <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
              <p>
                I work with healthcare and wellness organizations on the practical layers of the
                client journey — CRM logic, intake, scheduling, staff handoffs, knowledge access,
                and responsible AI-supported communication.
              </p>
              <p>
                Aponchuk Workflow Systems LLC is based in Sarasota, Florida and delivers services
                remotely across the United States.
              </p>
              <Link href="/about" className="inline-flex items-center gap-1.5 text-blue font-medium hover:underline">
                Read more about me <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
