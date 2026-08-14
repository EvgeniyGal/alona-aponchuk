"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

type ImagePlaceholderProps = {
  label: string;
  /** WebP filename in /public/images, e.g. home-hero-operations.webp */
  filename: string;
  /** Optional override; defaults to /images/{filename} */
  src?: string;
  aspect?: "hero" | "landscape" | "square" | "portrait" | "wide" | "fill";
  className?: string;
  tone?: "blue" | "teal" | "sage" | "gold" | "ivory";
  /** Hide developer label — use for backgrounds that sit under other UI */
  silent?: boolean;
  priority?: boolean;
};

const aspectClass = {
  hero: "aspect-[16/10] md:aspect-[21/9]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[21/9]",
  fill: "h-full w-full",
};

const toneClass = {
  blue: "from-blue-soft via-[#eef3f7] to-ivory",
  teal: "from-teal-soft via-[#eef6f7] to-ivory",
  sage: "from-sage-soft/70 via-[#eef2ee] to-ivory",
  gold: "from-[#f6ecd7] via-[#faf6ee] to-ivory",
  ivory: "from-muted via-ivory to-white",
};

/**
 * Loads /images/{filename} (WebP). Falls back to labeled placeholder if missing.
 */
export function ImagePlaceholder({
  label,
  filename,
  src,
  aspect = "landscape",
  className = "",
  tone = "blue",
  silent = false,
  priority = false,
}: ImagePlaceholderProps) {
  const imageSrc = src ?? `/images/${filename}`;
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <div
        className={`relative overflow-hidden border border-hairline ${aspectClass[aspect]} ${className}`}
        data-image-slot={filename}
      >
        <Image
          src={imageSrc}
          alt={label}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden border border-hairline bg-gradient-to-br ${toneClass[tone]} ${aspectClass[aspect]} ${className}`}
      data-image-slot={filename}
      role="img"
      aria-label={`${label} (placeholder — add ${filename} to /public/images)`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(70,106,134,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(79,157,166,0.16), transparent 40%), linear-gradient(135deg, transparent 40%, rgba(156,175,159,0.12) 100%)",
        }}
      />
      {!silent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-white/80 text-blue backdrop-blur-sm">
            <ImageIcon size={18} />
          </div>
          <div className="max-w-xs">
            <div className="font-display text-[14px] font-semibold text-graphite">{label}</div>
            <div className="mt-1 text-[11px] text-muted-foreground font-mono">{filename}</div>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue/30 to-transparent" />
    </div>
  );
}
