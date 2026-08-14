import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/page-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Disclaimer — Aponchuk Workflow Systems LLC" },
      {
        name: "description",
        content:
          "Terms of use and professional disclaimer covering the scope of consulting, workflow analysis, QA validation, and implementation-support services.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Page,
});

const EMAIL = "info@aponchukworkflow.com";
const EFFECTIVE_DATE = "January 1, 2026";

const sections = [
  {
    title: "Acceptance of Terms",
    body:
      "By accessing this website or engaging Aponchuk Workflow Systems LLC (\"the Firm\") for consulting services, you acknowledge that you have read, understood, and agreed to these Terms and Disclaimer. If you do not agree, please do not use this website or engage the Firm.",
  },
  {
    title: "Scope of Services",
    body:
      "The Firm provides consulting, workflow analysis, QA validation, and implementation-support services related to CRM systems, patient and client management workflows, knowledge base structuring, and responsible AI-supported communication. Services do not constitute medical, clinical, psychological, legal, cybersecurity, HIPAA, accounting, insurance, or compliance certification, and are not a substitute for advice from licensed professionals in those fields.",
  },
  {
    title: "Client Responsibility for Compliance",
    body:
      "Clients are solely responsible for evaluating and ensuring that any workflow, automation, or communication system implemented in whole or in part based on the Firm's recommendations complies with all applicable federal, state, and local laws and regulations, including HIPAA, HITECH, state privacy laws, telehealth regulations, and any professional licensing requirements. Any implementation involving protected health information, patient records, insurance data, or clinical decision support must be reviewed and approved by the client's legal, compliance, privacy, and clinical leadership prior to deployment.",
  },
  {
    title: "Human Escalation and Professional Oversight",
    body:
      "Any automated system that the Firm advises on or supports should include clearly documented escalation paths to qualified human staff. Automation is intended to support, not replace, licensed professionals. Clinical decisions, diagnostic determinations, and treatment recommendations must remain the responsibility of appropriately licensed individuals.",
  },
  {
    title: "AI-Supported Communication",
    body:
      "AI-supported communication designed, reviewed, or supported by the Firm is intended to operate within approved informational, administrative, scheduling, preparation, and follow-up boundaries. Any broader use of AI-mediated communication — including any use that could be interpreted as diagnosis, psychological assessment, clinical advice, or a substitute for professional judgment — must be explicitly approved by the client's licensed professionals and legal or compliance advisors, and is undertaken at the client's own risk.",
  },
  {
    title: "No Guarantees or Warranties",
    body:
      "Modeled workflow figures, efficiency estimates, retention indicators, and quality metrics shared on this website or during engagements are research-based indicators only. They are not guaranteed results. Actual outcomes depend on the client's systems, data quality, staff processes, implementation scope, operational context, and factors outside the Firm's control. The Firm makes no express or implied warranty of merchantability, fitness for a particular purpose, or non-infringement.",
  },
  {
    title: "No Certification Claims",
    body:
      "The Firm does not provide HIPAA certification, medical device certification, cybersecurity certification, SOC audit certification, or any other regulatory certification, and does not certify or guarantee compliance with any regulatory framework.",
  },
  {
    title: "Intellectual Property",
    body:
      "All content on this website, including text, graphics, diagrams, and logos, is the property of Aponchuk Workflow Systems LLC or its licensors and is protected by U.S. and international intellectual property laws. Deliverables produced during engagements are governed by the executed engagement agreement.",
  },
  {
    title: "Limitation of Liability",
    body:
      "To the maximum extent permitted by applicable law, Aponchuk Workflow Systems LLC and its principals shall not be liable for any indirect, incidental, consequential, special, or exemplary damages, or for any loss of profits, revenue, data, or business opportunities, arising out of or related to the use of this website or the Firm's services. The Firm's total aggregate liability for any claim arising from an engagement is limited to the fees paid by the client for the specific engagement giving rise to the claim.",
  },
  {
    title: "Governing Law",
    body:
      "These Terms are governed by the laws of the State of Florida, without regard to its conflict-of-laws principles. Any dispute arising from these Terms or from any engagement with the Firm shall be resolved in the state or federal courts located in Sarasota County, Florida, unless otherwise agreed in writing.",
  },
  {
    title: "Changes to These Terms",
    body:
      "The Firm may update these Terms from time to time. Material changes will be reflected by updating the effective date at the top of this page.",
  },
  {
    title: "Contact",
    body: `For questions about these Terms, contact Aponchuk Workflow Systems LLC at ${EMAIL}.`,
  },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Disclaimer"
        lead={`Effective date: ${EFFECTIVE_DATE}. Please read carefully. By engaging with Aponchuk Workflow Systems LLC, clients acknowledge the scope and limitations of the services described below.`}
      />
      <Section>
        <div className="space-y-6 max-w-3xl">
          {sections.map((s) => (
            <article key={s.title} className="rounded-2xl border border-hairline bg-white p-7">
              <h2 className="font-display text-xl text-graphite">{s.title}</h2>
              <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">{s.body}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
