"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type MarqueeProps = {
  items: string[];
  accent?: boolean;
};

export default function Marquee({ items, accent = false }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !trackRef.current) return;

    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: accent ? 18 : 26,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [accent]);

  const row = [...items, ...items];

  return (
    <div className={`marquee${accent ? " marquee--accent" : ""}`} aria-hidden="true">
      <div className="marquee__track" ref={trackRef}>
        {row.map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
