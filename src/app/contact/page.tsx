import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Request a Workflow Audit — Alona Aponchuk",
  description:
    "Request a diagnostic Workflow Audit. Share your CRM, scheduling, and communication setup to receive a structured review of where the client journey loses continuity.",
  path: "/contact",
  image: "/images/home-service-workflow-audit.webp",
  imageAlt: "Request a diagnostic Workflow Audit",
});

export default function ContactPage() {
  return <ContactForm />;
}
