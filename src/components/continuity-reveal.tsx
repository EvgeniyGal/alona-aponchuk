"use client";

import { useCallback, useId, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, GripVertical, Share2 } from "lucide-react";

type Row = { today: string; after: string };

type ContinuityRevealProps = {
  rows: Row[];
};

export function ContinuityReveal({ rows }: ContinuityRevealProps) {
  const [progress, setProgress] = useState(42);
  const [copied, setCopied] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const labelId = useId();

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setProgress(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const share = async () => {
    const text =
      "Today vs After Implementation — drag to reveal how structured workflows change client journey continuity.";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Workflow Continuity Reveal", text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled share
    }
  };

  const afterOpacity = Math.max(0.15, progress / 100);
  const todayOpacity = Math.max(0.15, 1 - progress / 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_24px_60px_-40px_rgba(31,41,51,0.35)]">
      <div className="flex flex-col gap-4 border-b border-hairline bg-gradient-to-r from-muted/80 via-white to-teal-soft/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <div className="eyebrow">Interactive Continuity Reveal</div>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Drag the handle to move between Today and After Implementation.
          </p>
        </div>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-hairline bg-white px-3.5 py-2 text-[13px] font-medium text-graphite transition-colors hover:border-blue/40 hover:text-blue"
        >
          <Share2 size={14} />
          {copied ? "Link copied" : "Share this reveal"}
        </button>
      </div>

      <div
        ref={trackRef}
        className="relative select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="grid md:grid-cols-2">
          <div
            className="border-b border-hairline p-5 transition-opacity duration-150 md:border-b-0 md:border-r md:p-7"
            style={{ opacity: todayOpacity }}
          >
            <div className="eyebrow" style={{ color: "#8a6a2b" }}>
              Today
            </div>
            <ul className="mt-5 space-y-4">
              {rows.map((row) => (
                <li key={row.today} className="flex gap-3 text-[14.5px] text-graphite leading-relaxed">
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span>{row.today}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden p-5 md:p-7" style={{ opacity: afterOpacity }}>
            <div
              className="pointer-events-none absolute inset-0 bg-teal-soft/50"
              style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
            />
            <div className="relative">
              <div className="eyebrow" style={{ color: "#2f6f77" }}>
                After Implementation
              </div>
              <ul className="mt-5 space-y-4">
                {rows.map((row) => (
                  <li key={row.after} className="flex gap-3 text-[14.5px] text-graphite leading-relaxed">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal" />
                    <span>{row.after}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 hidden w-px bg-blue/50 md:block"
          style={{ left: `${progress}%` }}
          aria-hidden
        >
          <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue/30 bg-white text-blue shadow-[0_8px_24px_-10px_rgba(70,106,134,0.55)]">
            <GripVertical size={18} />
          </div>
        </div>
      </div>

      <div className="border-t border-hairline bg-ivory/70 px-5 py-4 sm:px-7">
        <label htmlFor={labelId} className="sr-only">
          Continuity reveal progress
        </label>
        <input
          id={labelId}
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="continuity-range w-full"
          aria-valuetext={`${Math.round(progress)} percent toward After Implementation`}
        />
        <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span style={{ color: "#8a6a2b" }}>Today</span>
          <span className="text-blue">{Math.round(progress)}%</span>
          <span style={{ color: "#2f6f77" }}>After</span>
        </div>
      </div>
    </div>
  );
}
