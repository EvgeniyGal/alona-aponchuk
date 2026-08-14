"use client";

import { useEffect, useState } from "react";
import { ImagePlaceholder } from "@/components/image-placeholder";

/** Hero background image — rendered only at lg+ so mobile/tablet skip the download. */
export function HeroAtmosphere() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute inset-y-0 right-0 w-[52%]">
        <ImagePlaceholder
          label="Hero: calm clinical operations atmosphere"
          filename="home-hero-operations.webp"
          aspect="fill"
          tone="teal"
          silent
          priority
          className="border-0 rounded-none"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-white/50" />
    </div>
  );
}
