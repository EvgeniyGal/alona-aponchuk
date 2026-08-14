import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Linkedin, ExternalLink } from "lucide-react";
import { Section, CtaBand } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "About Alona Aponchuk — CRM, Patient Management & Digital Workflow Systems",
  description:
    "Executive biography of Alona Aponchuk: QA engineer and workflow systems consultant specializing in CRM, patient management, healthcare and wellness workflows, RAG readiness, and responsible AI-supported communication.",
  openGraph: {
    title: "About Alona Aponchuk",
    description: "Executive consulting profile — CRM, patient management, workflow reliability, and responsible AI.",
    url: "/about",
  },
  alternates: { canonical: "/about" },
};

const experience = [
  {
    dates: "2026 – Present",
    role: "CRM & Workflow Systems Specialist",
    org: "International Institute of Psychological Maturity",
    location: "United States",
    body:
      "Independent contractor responsible for CRM administration, workflow optimization, registration and participant management systems, communication automation, reporting logic, and digital infrastructure supporting educational and scientific programs, including international conference operations.",
  },
  {
    dates: "2026 – Present",
    role: "AI & Digital Systems Subcontractor",
    org: "Opulentia SC LLC",
    location: "Florida, USA",
    body:
      "Supporting the design and implementation of AI-based digital systems, workflow architectures, educational technologies, CRM-connected environments, knowledge-base supported platforms, and automation-oriented systems, including the PersonaMatrix project and RAG-supported workflow research.",
  },
  {
    dates: "2025 – Present",
    role: "CRM, EHR & Clinical Workflow Consultant",
    org: "Health & Beauty Integrative Center",
    location: "Florida, USA",
    body:
      "Consultant supporting CharmHealth CRM/EHR administration, patient intake and medical form design, clinical templates for IV therapies, IM injections and laboratory procedures, scheduling and inventory workflows (Blologic), staff training, documentation processes, and operational workflow improvement across clinical and front-office teams.",
  },
  {
    dates: "Dec 2020 – Jun 2021",
    role: "Manual QA Engineer",
    org: "BeWell Innovations — Well@Home™ digital health platform",
    location: "Remote",
    body:
      "Functional and regression testing of a clinically validated digital health platform used by hospitals, clinics, and private practices. Validated patient-facing workflows and system interactions and contributed to platform stability and consistency.",
  },
  {
    dates: "May 2019 – Mar 2020",
    role: "Manual QA Engineer",
    org: "TEAM International — Adapt (U.S. staffing & recruitment platform)",
    location: "Remote",
    body:
      "Functional, regression, and system testing across a workflow-heavy enterprise platform integrating with data warehousing and third-party systems. Validated business workflows and cross-system data flow within Agile / Scrum delivery.",
  },
  {
    dates: "Sep 2017 – May 2019",
    role: "Manual QA Engineer",
    org: "Mediasapiens — ASK E-Learning (20,000+ users) and Easy Fish mobile app",
    location: "Remote",
    body:
      "Requirements analysis, test documentation, workflow validation, and production quality assurance across a multilingual large-scale educational platform and a consumer mobile application.",
  },
  {
    dates: "May 2017 – Aug 2017",
    role: "Junior Manual QA Engineer",
    org: "Itomych Studio — FitGrid Pro",
    location: "Remote",
    body:
      "Functional testing, requirements analysis, and validation of scheduling, instructor management, and client retention workflows — an early foundation for scheduling and client management systems work.",
  },
];

const education = [
  {
    degree: "Master of Science in Information Science",
    school: 'National Technical University "Kharkiv Polytechnic Institute"',
    dates: "2014 – 2016",
    location: "Kharkiv, Ukraine",
  },
  {
    degree: "Bachelor of Science in Computer Science, with Honors",
    school: 'National Technical University "Kharkiv Polytechnic Institute"',
    dates: "2010 – 2014",
    location: "Kharkiv, Ukraine",
  },
];

const expertise = [
  "CRM Administration & Optimization",
  "Patient Management Systems",
  "Client Journey Design & Validation",
  "Healthcare & Wellness Workflows",
  "Scheduling & Intake Process Validation",
  "Requirements Analysis",
  "Functional & Regression Testing",
  "Workflow Mapping",
  "Digital Process Optimization",
  "AI-Enabled Service Systems",
  "RAG-Based Client Journey Automation",
  "Knowledge Base Design",
  "User Journey Validation",
  "Data Consistency & Workflow Reliability",
  "Agile / Scrum",
  "Jira, Redmine, TestRail, Postman",
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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-hairline bg-white p-8">
      <h2 className="font-display text-xl md:text-2xl text-graphite">{title}</h2>
      <div className="mt-5 text-[15px] text-muted-foreground leading-relaxed space-y-4">
        {children}
      </div>
    </article>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-hairline bg-white">
        <div className="container-page py-16 md:py-24 grid gap-12 lg:grid-cols-[1fr_1.4fr] items-center">
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-3 rounded-2xl bg-sage-soft/40 -z-10" aria-hidden />
              <Image
                src="/alona-portrait.jpg"
                alt="Portrait of Alona Aponchuk, workflow systems consultant"
                width={480}
                height={480}
                className="w-full aspect-square object-cover rounded-2xl border border-hairline shadow-sm"
                priority
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="eyebrow">About Me</div>
            <h1 className="mt-4 font-display text-[36px] md:text-5xl font-semibold text-graphite leading-[1.1]">
              Alona Aponchuk
            </h1>
            <p className="mt-3 font-display text-lg text-graphite/80">
              QA Engineer · CRM, Patient Management & Digital Workflow Systems Specialist
            </p>
            <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed max-w-xl">
              I am the founder of Aponchuk Workflow Systems LLC. I help healthcare and wellness
              organizations build reliable digital workflows, optimize CRM and patient management
              processes, structure knowledge for responsible AI-supported communication, and validate
              client journeys through applied QA methods.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-blue" /> Sarasota, Florida</span>
              <a href="mailto:info@aponchukworkflow.com" className="inline-flex items-center gap-1.5 hover:text-blue">
                <Mail size={14} /> info@aponchukworkflow.com
              </a>
              <a
                href="https://www.linkedin.com/in/alona-aponchuk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
              <span className="text-muted-foreground/80">ORCID 0009-0008-3505-7871</span>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <SectionCard title="Professional Introduction">
            <p>
              For more than eight years I have worked at the intersection of software quality
              assurance, CRM administration, and workflow design. My focus is the operational
              reliability of systems that support people — patients, clients, program participants,
              and the staff who serve them.
            </p>
            <p>
              I work remotely with organizations across the United States and specialize in
              healthcare, wellness, and mission-driven service environments where continuity of
              the client journey directly affects the quality of care.
            </p>
          </SectionCard>

          <SectionCard title="Professional Background">
            <p>
              My professional path began in enterprise QA engineering, validating complex platforms
              in staffing, education, digital health, and consumer applications. That work shaped a
              disciplined approach to requirements analysis, workflow validation, and cross-system
              data integrity.
            </p>
            <p>
              Over time my focus shifted from testing software to designing the operational
              workflows the software is meant to support — CRM logic, patient intake, scheduling,
              staff handoffs, knowledge access, and responsible automation.
            </p>
          </SectionCard>
        </div>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <div className="max-w-2xl">
          <div className="eyebrow">Areas of Expertise</div>
          <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
            Where my consulting work is concentrated.
          </h2>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-hairline bg-ivory/60 px-4 py-3 text-[14px] text-graphite"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="max-w-2xl">
          <div className="eyebrow">Professional Experience</div>
          <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
            Selected engagements across healthcare, wellness, education, and enterprise systems.
          </h2>
        </div>
        <div className="mt-12 space-y-6">
          {experience.map((e) => (
            <article key={`${e.role}-${e.dates}`} className="rounded-2xl border border-hairline bg-white p-7 md:p-8">
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
          ))}
        </div>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] items-start">
          <div>
            <div className="eyebrow">Education</div>
            <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
              Formal training in information science and computer science.
            </h2>
          </div>
          <div className="space-y-5">
            {education.map((ed) => (
              <div key={ed.degree} className="rounded-xl border border-hairline bg-white p-6">
                <div className="font-display text-[16px] font-semibold text-graphite">{ed.degree}</div>
                <div className="mt-1 text-[14px] text-graphite/80">{ed.school}</div>
                <div className="mt-1 text-[13px] text-muted-foreground">{ed.dates} · {ed.location}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <SectionCard title="Current Consulting Focus">
            <p>
              Today my work centers on medical practices, wellness centers, medspas, therapy
              practices, rehabilitation programs, aesthetics clinics, and integrative health
              organizations. Typical engagements involve CRM and EHR workflow optimization,
              patient intake and scheduling reliability, knowledge base structuring, RAG
              readiness, and QA validation of AI-supported communication.
            </p>
            <p>
              All services are delivered remotely from Sarasota, Florida to organizations across
              the United States.
            </p>
          </SectionCard>

          <SectionCard title="Professional Philosophy">
            <p>
              Reliable workflows are a form of care. When intake, scheduling, follow-up, and
              communication behave predictably, staff spend less time correcting the system and
              more time serving people.
            </p>
            <p>
              I treat automation — including AI-supported communication — as one layer of a
              broader operational system that must be documented, bounded, tested, and reviewed
              by qualified human professionals. Automation earns its place by strengthening the
              client journey, never by replacing professional judgment.
            </p>
          </SectionCard>
        </div>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <div className="max-w-2xl">
          <div className="eyebrow">Research & Publications</div>
          <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
            Applied research in AI-enabled workflow systems and client journey automation.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            My research interests include CRM-enabled service delivery, healthcare and wellness
            workflows, patient management systems, AI-mediated communication, and RAG-based
            client journey automation.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {publications.map((p) => (
            <article key={p.doi} className="rounded-xl border border-hairline bg-white p-6">
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
          ))}
        </div>
        <p className="mt-8 text-[13px] text-muted-foreground max-w-3xl leading-relaxed">
          I also served as Conference Operations & Digital Workflow Coordinator for the
          international scientific conference “Beyond Human: AI, Consciousness, Personality
          and the Future of Human Development” (September 2026), supporting registration,
          participant communications, speaker onboarding, and post-conference documentation.
        </p>
      </Section>

      <div className="container-page pb-4 pt-2">
        <div className="rounded-2xl border border-hairline bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <p className="text-[14.5px] text-muted-foreground leading-relaxed md:flex-1">
            If you would like to discuss whether my approach fits your organization,
            request a diagnostic Workflow Audit or reach me directly by email.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md bg-blue px-5 py-3 text-[14px] font-medium text-white hover:bg-blue/90"
            >
              Request Workflow Audit
            </Link>
            <Link
              href="/method"
              className="inline-flex items-center rounded-md border border-hairline bg-white px-5 py-3 text-[14px] font-medium text-graphite hover:bg-muted"
            >
              Explore My Method
            </Link>
          </div>
        </div>
      </div>

      <CtaBand />
    </>
  );
}
