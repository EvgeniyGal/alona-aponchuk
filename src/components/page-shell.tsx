import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  image?: {
    filename: string;
    label: string;
    tone?: "blue" | "teal" | "sage" | "gold" | "ivory";
  };
}) {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 100% 0%, rgba(79,157,166,0.12), transparent 55%), radial-gradient(ellipse 40% 40% at 0% 100%, rgba(156,175,159,0.12), transparent 50%)",
        }}
      />
      <div
        className={`relative container-page py-16 md:py-24 ${
          image ? "grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center" : "max-w-4xl"
        }`}
      >
        <Reveal variant="up" className="w-full min-w-0">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="mt-4 font-display text-[36px] md:text-5xl font-semibold text-graphite leading-[1.1]">
            {title}
          </h1>
          {lead && (
            <p className="mt-6 text-lg text-muted-foreground w-full max-w-none lg:max-w-3xl leading-relaxed">
              {lead}
            </p>
          )}
        </Reveal>
        {image && (
          <Reveal variant="right" delayMs={100} className="hidden lg:block">
            <ImagePlaceholder
              label={image.label}
              filename={image.filename}
              aspect="landscape"
              tone={image.tone ?? "teal"}
              className="rounded-2xl shadow-[0_24px_50px_-36px_rgba(31,41,51,0.35)]"
              priority
            />
          </Reveal>
        )}
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
    <section className="bg-graphite text-white relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 80% at 100% 50%, rgba(70,106,134,0.55), transparent 60%)",
        }}
      />
      <div className="relative container-page py-16 md:py-20 grid gap-8 md:grid-cols-[1.4fr_auto] items-center">
        <Reveal variant="up">
          <h2 className="font-display text-2xl md:text-3xl text-white leading-tight">
            Ready to see where your client journey loses continuity?
          </h2>
          <p className="mt-4 text-[15px] text-white/70 max-w-2xl leading-relaxed">
            Request a Workflow Audit. I map your current CRM, intake, scheduling, and follow-up
            paths, and identify where structured workflows and responsible AI can strengthen continuity.
          </p>
        </Reveal>
        <Reveal delayMs={80} className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
          <Link
            href="/contact"
            className="cta-shimmer inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-blue px-6 py-3 text-[14.5px] font-medium text-white hover:bg-blue/90 transition-colors"
          >
            Request Workflow Audit <ArrowRight size={16} />
          </Link>
          <Link
            href="/method"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-white/25 bg-transparent px-6 py-3 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
          >
            Explore My Method
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
