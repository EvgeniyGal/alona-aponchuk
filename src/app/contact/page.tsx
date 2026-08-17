import { ContactForm } from "@/components/contact-form";
import { translatedPageMetadata } from "@/i18n/page-metadata";

export async function generateMetadata() {
  return translatedPageMetadata({
    namespace: "contact",
    path: "/contact",
    image: "/images/home-service-workflow-audit.webp",
  });
}

export default function ContactPage() {
  return <ContactForm />;
}
