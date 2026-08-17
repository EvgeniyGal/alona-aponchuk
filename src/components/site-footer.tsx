"use client";

import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const EMAIL = "info@aponchukworkflow.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/alona-aponchuk/";

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const common = useTranslations("common");

  return (
    <footer className="border-t border-hairline bg-white">
      <div className="container-page py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Image src="/logo.webp" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
            <div>
              <div className="font-display text-[15.5px] font-semibold text-graphite">Alona Aponchuk</div>
              <div className="text-[12px] text-muted-foreground">{nav("tagline")}</div>
            </div>
          </div>
          <p className="mt-5 text-[14px] text-muted-foreground max-w-md leading-relaxed">{t("blurb")}</p>
          <p className="mt-5 text-[12px] text-muted-foreground max-w-md leading-relaxed">{t("disclaimer")}</p>
        </div>

        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-graphite">{t("navigate")}</h4>
          <ul className="mt-5 space-y-2.5 text-[14px] text-muted-foreground">
            <li>
              <Link href="/mission" className="hover:text-blue">
                {nav("mission")}
              </Link>
            </li>
            <li>
              <Link href="/method" className="hover:text-blue">
                {nav("method")}
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue">
                {nav("services")}
              </Link>
            </li>
            <li>
              <Link href="/case-stories" className="hover:text-blue">
                {nav("caseStories")}
              </Link>
            </li>
            <li>
              <Link href="/responsible-ai" className="hover:text-blue">
                {nav("responsibleAi")}
              </Link>
            </li>
            <li>
              <Link href="/research" className="hover:text-blue">
                {t("researchBasis")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue">
                {t("aboutAlona")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-graphite">{t("contactLegal")}</h4>
          <ul className="mt-5 space-y-2.5 text-[14px] text-muted-foreground">
            <li>
              <Link href="/contact" className="hover:text-blue">
                {common("requestAudit")}
              </Link>
            </li>
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
                <Linkedin size={14} /> {t("linkedin")}
              </a>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-blue" /> {t("location")}
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-blue">
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="container-page py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-muted-foreground">
          <div>{t("copyright", { year: new Date().getFullYear() })}</div>
          <div>{t("remote")}</div>
        </div>
      </div>
    </footer>
  );
}
