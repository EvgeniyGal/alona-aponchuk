import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-hairline bg-white">
      <div className="container-page py-16 md:py-24 max-w-4xl">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-4 font-display text-[36px] md:text-5xl font-semibold text-graphite leading-[1.1]">{title}</h1>
        {lead && <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">{lead}</p>}
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-20 md:py-24 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="bg-graphite text-white">
      <div className="container-page py-16 md:py-20 grid gap-8 md:grid-cols-[1.4fr_auto] items-center">
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-white leading-tight">
            Ready to see where your client journey loses continuity?
          </h2>
          <p className="mt-4 text-[15px] text-white/70 max-w-2xl leading-relaxed">
            Request a Workflow Audit. I map your current CRM, intake, scheduling, and follow-up
            paths, and identify where structured workflows and responsible AI can strengthen continuity.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-blue px-6 py-3 text-[14.5px] font-medium text-white hover:bg-blue/90 transition-colors"
          >
            Request Workflow Audit <ArrowRight size={16} />
          </Link>
          <Link
            to="/method"
            className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-transparent px-6 py-3 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
          >
            Explore My Method
          </Link>
        </div>
      </div>
    </section>
  );
}
