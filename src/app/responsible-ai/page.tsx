import type { Metadata } from "next";
import { PageHero, Section, CtaBand } from "@/components/page-shell";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Responsible AI — Bounded, QA-Validated Client Communication",
  description:
    "I scope AI-supported communication to approved informational, administrative, scheduling, preparation, and follow-up interactions — never diagnosis, clinical advice, or guaranteed outcomes.",
  openGraph: {
    title: "Responsible AI in Healthcare & Wellness Workflows",
    description: "AI belongs in the operational layer of the client journey, not in place of professional judgment.",
    url: "/responsible-ai",
  },
  alternates: { canonical: "/responsible-ai" },
};

const allowed = [
  "Approved informational questions",
  "Administrative communication",
  "Scheduling and confirmations",
  "Preparation instructions",
  "Reminders",
  "Follow-up touchpoints",
];

const notAllowed = [
  "Diagnosis",
  "Psychological assessment",
  "Medical or clinical advice",
  "Guaranteed outcomes",
  "Pressure-based conversion",
  "Replacement of licensed professionals",
];

const generic = [
  "Unverified knowledge sources",
  "Undefined response boundaries",
  "No structured human review",
  "No documented escalation path",
  "No behavioral or drift testing",
  "No access controls",
];

const calibrated = [
  "Verified, versioned knowledge base",
  "Defined response boundaries",
  "Human review of ambiguous cases",
  "Documented escalation paths",
  "Response stability & drift testing",
  "Access controls where appropriate",
];

export default function ResponsibleAiPage() {
  return (
    <>
      <PageHero
        eyebrow="Responsible AI"
        title="AI Should Support the Client Journey — Not Replace Professional Judgment."
        lead="I place automation in the operational layer of the client journey. It handles routine, bounded, informational communication so licensed professionals can focus on clinical and therapeutic work."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-teal/40 bg-teal-soft/40 p-8">
            <h2 className="font-display text-xl md:text-2xl text-graphite">AI-supported communication may assist with</h2>
            <ul className="mt-5 space-y-3">
              {allowed.map((a) => (
                <li key={a} className="flex gap-3 text-[15px] text-graphite leading-relaxed">
                  <CheckCircle2 size={18} className="mt-0.5 text-teal shrink-0" /> {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-hairline bg-white p-8">
            <h2 className="font-display text-xl md:text-2xl text-graphite">AI must not independently provide</h2>
            <ul className="mt-5 space-y-3">
              {notAllowed.map((a) => (
                <li key={a} className="flex gap-3 text-[15px] text-graphite leading-relaxed">
                  <XCircle size={18} className="mt-0.5 text-gold shrink-0" /> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-white border-y border-hairline">
        <div className="max-w-2xl">
          <div className="eyebrow">Comparison</div>
          <h2 className="mt-3 font-display text-3xl text-graphite leading-tight">
            Generic Chatbot vs. Calibrated RAG Workflow
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The same underlying technology can behave very differently depending on how it is scoped,
            grounded, and monitored.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-hairline p-8 bg-white">
            <div className="eyebrow" style={{ color: "#8a6a2b" }}>Generic Chatbot</div>
            <ul className="mt-5 space-y-3">
              {generic.map((g) => (
                <li key={g} className="text-[15px] text-muted-foreground leading-relaxed">· {g}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-teal/40 bg-teal-soft/40 p-8">
            <div className="eyebrow" style={{ color: "#2f6f77" }}>Calibrated RAG Workflow</div>
            <ul className="mt-5 space-y-3">
              {calibrated.map((g) => (
                <li key={g} className="text-[15px] text-graphite leading-relaxed">· {g}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
