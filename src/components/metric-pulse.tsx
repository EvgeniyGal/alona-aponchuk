"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

type MetricPulseProps = {
  from: string;
  to: string;
  label: string;
  delayMs?: number;
};

export function MetricPulse({ from, to, label, delayMs = 0 }: MetricPulseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setActive(true), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`metric-pulse rounded-2xl border border-hairline bg-ivory/50 p-6 ${active ? "is-active" : ""}`}
    >
      <div className="text-[10.5px] font-semibold uppercase tracking-wider text-blue">
        Research-Based Modeled Indicator
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-[15px] text-muted-foreground line-through">{from}</span>
        <ArrowRight size={14} className="text-blue metric-arrow" />
        <span className="font-display text-2xl font-semibold text-graphite metric-to">{to}</span>
      </div>
      <div className="mt-2 text-[13px] text-muted-foreground leading-relaxed">{label}</div>
    </div>
  );
}
