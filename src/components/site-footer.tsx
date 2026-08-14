import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail, MapPin } from "lucide-react";

const EMAIL = "info@aponchukworkflow.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/alona-aponchuk/";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-white">
      <div className="container-page py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
            <div>
              <div className="font-display text-[15.5px] font-semibold text-graphite">Alona Aponchuk</div>
              <div className="text-[12px] text-muted-foreground">Aponchuk Workflow Systems LLC</div>
            </div>
          </div>
          <p className="mt-5 text-[14px] text-muted-foreground max-w-md leading-relaxed">
            I work with healthcare and wellness organizations on reliable digital workflows,
            CRM optimization, client journey design, and responsible AI-supported communication.
            Based in Sarasota, Florida. Remote consulting available across the United States.
          </p>
          <p className="mt-5 text-[12px] text-muted-foreground max-w-md leading-relaxed">
            Services are consulting, workflow analysis, QA validation, and implementation support.
            They do not constitute medical, legal, clinical, cybersecurity, HIPAA, accounting, or
            compliance certification.
          </p>
        </div>

        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-graphite">Navigate</h4>
          <ul className="mt-5 space-y-2.5 text-[14px] text-muted-foreground">
            <li><Link href="/mission" className="hover:text-blue">Mission</Link></li>
            <li><Link href="/method" className="hover:text-blue">Method</Link></li>
            <li><Link href="/services" className="hover:text-blue">Services</Link></li>
            <li><Link href="/case-stories" className="hover:text-blue">Case Stories</Link></li>
            <li><Link href="/responsible-ai" className="hover:text-blue">Responsible AI</Link></li>
            <li><Link href="/research" className="hover:text-blue">Research Basis</Link></li>
            <li><Link href="/about" className="hover:text-blue">About Alona</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-graphite">Contact & Legal</h4>
          <ul className="mt-5 space-y-2.5 text-[14px] text-muted-foreground">
            <li><Link href="/contact" className="hover:text-blue">Request Workflow Audit</Link></li>
            <li>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 hover:text-blue">
                <Mail size={14} /> {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            </li>
            <li className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-blue" /> Sarasota, Florida</li>
            <li><Link href="/privacy" className="hover:text-blue">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue">Terms & Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="container-page py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-muted-foreground">
          <div>© {new Date().getFullYear()} Aponchuk Workflow Systems LLC. All rights reserved.</div>
          <div>Sarasota, Florida · Remote consulting across the United States.</div>
        </div>
      </div>
    </footer>
  );
}
