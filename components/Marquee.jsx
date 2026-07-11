"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Marquee({ items, accent = false }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: accent ? 18 : 26,
      ease: "none",
      repeat: -1,
    });

    return () => tween.kill();
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
