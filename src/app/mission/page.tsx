import type { Metadata } from "next";
import { PageHero, Section, CtaBand } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Mission — Reliable Digital Workflows for Human-Centered Care",
  description:
    "The client journey is one connected operational system. CRM, intake, scheduling, communication, knowledge, and automation must work together reliably.",
  openGraph: {
    title: "Mission — Aponchuk Workflow Systems",
    description: "Reliable workflows for human-centered healthcare and wellness organizations.",
    url: "/mission",
  },
  alternates: { canonical: "/mission" },
};

export default function MissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Mission"
        title="Reliable Digital Workflows for Human-Centered Care"
        lead="I view the client journey as one connected operational system, not a collection of separate tools. When CRM, intake forms, scheduling, staff handoffs, communication, knowledge access, and automation work together reliably, technology stops interrupting care and starts supporting it."
        image={{
          filename: "home-mission-continuum.webp",
          label: "Connected care continuum",
          tone: "sage",
        }}
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal variant="up">
            <div className="service-card h-full rounded-2xl border border-hairline bg-white p-8">
              <h2 className="font-display text-2xl text-graphite">What I believe</h2>
              <ul className="mt-5 space-y-3.5 text-[15px] text-muted-foreground leading-relaxed">
                <li>· Continuity of the client journey is an operational responsibility, not a marketing outcome.</li>
                <li>· Every automation must sit on top of documented workflows and verified knowledge.</li>
                <li>· AI-mediated communication requires boundaries, testing, and human escalation.</li>
                <li>· Staff experience and client experience improve together — or not at all.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal variant="up" delayMs={80}>
            <div className="service-card h-full rounded-2xl border border-hairline bg-white p-8">
              <h2 className="font-display text-2xl text-graphite">How I work</h2>
              <ul className="mt-5 space-y-3.5 text-[15px] text-muted-foreground leading-relaxed">
                <li>· I start from the real client journey, not the tool stack.</li>
                <li>· I document CRM logic, statuses, and handoffs before adding automation.</li>
                <li>· I structure a verified knowledge base as the foundation of AI-supported responses.</li>
                <li>· I validate every automated interaction against defined quality metrics.</li>
                <li>· I pilot changes in a controlled scope, then expand deliberately.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
