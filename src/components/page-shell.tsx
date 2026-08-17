import type { ReactNode } from "react";
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
