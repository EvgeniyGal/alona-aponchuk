import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/page-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Aponchuk Workflow Systems LLC" },
      {
        name: "description",
        content:
          "How Aponchuk Workflow Systems LLC collects, uses, and protects information submitted through this website.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Page,
});

const EMAIL = "info@aponchukworkflow.com";
const EFFECTIVE_DATE = "January 1, 2026";

const sections = [
  {
    title: "Introduction",
    body:
      "Aponchuk Workflow Systems LLC (\"we,\" \"our,\" or \"us\") respects your privacy. This Privacy Policy describes how we collect, use, and protect information that you provide when you use this website or communicate with us regarding our consulting services. By using this website, you agree to the practices described below.",
  },
  {
    title: "Information We Collect",
    body:
      "We collect only the information you voluntarily submit through the Request Workflow Audit form or through direct correspondence with us. This may include your name, organization, email address, phone number, website, role, information about the systems your organization uses (such as CRM or scheduling tools), and descriptions of the workflow challenges you would like to discuss. We do not use this website to collect protected health information, patient records, financial account data, or government identifiers.",
  },
  {
    title: "How We Use Information",
    body:
      "We use submitted information solely to respond to your inquiry, scope potential engagements, deliver requested consulting services, maintain professional records of client communications, and comply with applicable legal or regulatory obligations. We do not sell, rent, or trade your information.",
  },
  {
    title: "Protected Health Information (PHI)",
    body:
      "This website is not designed for the transmission or storage of Protected Health Information as defined under HIPAA, patient identifiers, insurance information, or clinical records. Please do not submit any such information through this website. If a consulting engagement requires review of workflows that involve PHI, that work is scoped separately under a written agreement and, where required, an appropriate Business Associate Agreement or equivalent arrangement.",
  },
  {
    title: "Cookies and Analytics",
    body:
      "This website uses only the essential cookies required for basic functionality. If web analytics are introduced in the future, they will be limited to aggregated, non-identifying usage data, and this Privacy Policy will be updated to reflect that change.",
  },
  {
    title: "Third-Party Service Providers",
    body:
      "We use standard third-party service providers to host this website, deliver email, and process contact form submissions. These providers are engaged only to the extent necessary to operate the website and communicate with you, and they are bound by their own contractual and legal obligations regarding data handling.",
  },
  {
    title: "Data Retention",
    body:
      "We retain inquiry information only for as long as reasonably necessary to respond to your inquiry, deliver requested services, and meet legitimate business or legal recordkeeping needs. You may request deletion of your inquiry data at any time by contacting us at the address below.",
  },
  {
    title: "Security",
    body:
      "We take reasonable administrative and technical measures to protect information submitted through this website. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "Children's Privacy",
    body:
      "This website is intended for use by professionals and organizational representatives. We do not knowingly collect information from children under 13.",
  },
  {
    title: "Changes to This Policy",
    body:
      "We may update this Privacy Policy periodically. Material changes will be reflected by updating the effective date at the top of this page.",
  },
  {
    title: "Contact",
    body: `For privacy questions, data deletion requests, or corrections, contact Aponchuk Workflow Systems LLC at ${EMAIL}.`,
  },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lead={`Effective date: ${EFFECTIVE_DATE}. Aponchuk Workflow Systems LLC, Sarasota, Florida.`}
      />
      <Section>
        <div className="max-w-3xl space-y-6">
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
