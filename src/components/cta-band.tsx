import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";

export async function CtaBand() {
  const t = await getTranslations("cta");
  const common = await getTranslations("common");

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
          <h2 className="font-display text-2xl md:text-3xl text-white leading-tight">{t("title")}</h2>
          <p className="mt-4 text-[15px] text-white/70 max-w-2xl leading-relaxed">{t("body")}</p>
        </Reveal>
        <Reveal delayMs={80} className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
          <Link
            href="/contact"
            className="cta-shimmer inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-blue px-6 py-3 text-[14.5px] font-medium text-white hover:bg-blue/90 transition-colors"
          >
            {common("requestAudit")} <ArrowRight size={16} />
          </Link>
          <Link
            href="/method"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-white/25 bg-transparent px-6 py-3 text-[14.5px] font-medium text-white hover:bg-white/10 transition-colors"
          >
            {common("exploreMethod")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
