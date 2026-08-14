import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, CtaBand } from "@/components/page-shell";

export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "Mission — Reliable Digital Workflows for Human-Centered Care" },
      {
        name: "description",
        content:
          "The client journey is one connected operational system. CRM, intake, scheduling, communication, knowledge, and automation must work together reliably.",
      },
      { property: "og:title", content: "Mission — Aponchuk Workflow Systems" },
      { property: "og:description", content: "Reliable workflows for human-centered healthcare and wellness organizations." },
      { property: "og:url", content: "/mission" },
    ],
    links: [{ rel: "canonical", href: "/mission" }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Mission"
        title="Reliable Digital Workflows for Human-Centered Care"
        lead="I view the client journey as one connected operational system, not a collection of separate tools. When CRM, intake forms, scheduling, staff handoffs, communication, knowledge access, and automation work together reliably, technology stops interrupting care and starts supporting it."
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-hairline bg-white p-8">
            <h2 className="font-display text-2xl text-graphite">What I believe</h2>
            <ul className="mt-5 space-y-3.5 text-[15px] text-muted-foreground leading-relaxed">
              <li>· Continuity of the client journey is an operational responsibility, not a marketing outcome.</li>
              <li>· Every automation must sit on top of documented workflows and verified knowledge.</li>
              <li>· AI-mediated communication requires boundaries, testing, and human escalation.</li>
              <li>· Staff experience and client experience improve together — or not at all.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-hairline bg-white p-8">
            <h2 className="font-display text-2xl text-graphite">How I work</h2>
            <ul className="mt-5 space-y-3.5 text-[15px] text-muted-foreground leading-relaxed">
              <li>· I start from the real client journey, not the tool stack.</li>
              <li>· I document CRM logic, statuses, and handoffs before adding automation.</li>
              <li>· I structure a verified knowledge base as the foundation of AI-supported responses.</li>
              <li>· I validate every automated interaction against defined quality metrics.</li>
              <li>· I pilot changes in a controlled scope, then expand deliberately.</li>
            </ul>
          </div>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
