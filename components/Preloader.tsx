"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      window.__preloaderDone = true;
      setDone(true);
      window.dispatchEvent(new Event("preloader:done"));
    };

    if (reduced) {
      finish();
      return;
    }

    const counter = { value: 0 };
    const tl = gsap.timeline({ onComplete: finish });

    tl.to(counter, {
      value: 100,
      duration: 1.1,
      delay: 0.25,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
        }
      },
    }).to(rootRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div className="preloader" ref={rootRef}>
      <div className="preloader__name">
        sohaib<span className="accent">.dev</span>
      </div>
      <div className="preloader__count" ref={countRef}>
        000
      </div>
    </div>
  );
}
