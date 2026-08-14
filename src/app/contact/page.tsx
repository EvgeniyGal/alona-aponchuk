import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Request a Workflow Audit — Alona Aponchuk",
  description:
    "Request a diagnostic Workflow Audit. Share your CRM, scheduling, and communication setup to receive a structured review of where the client journey loses continuity.",
  openGraph: {
    title: "Request a Workflow Audit",
    description: "Diagnostic consulting form for healthcare and wellness organizations across the United States.",
    url: "/contact",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactForm />;
}
