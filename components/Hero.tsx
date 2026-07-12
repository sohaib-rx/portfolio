"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chrome = root.querySelectorAll(".hero__meta, .hero__bottom, .hero__scroll");
    const lines = root.querySelectorAll(".hero__line > span");

    const ctx = gsap.context(() => {
      gsap.set(chrome, { autoAlpha: reduced ? 1 : 0 });
      if (!reduced) {
        gsap.set(lines, { yPercent: 110 });
        gsap.to(".hero__inner", {
          yPercent: -12,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, root);

    const intro = () => {
      if (reduced) return;
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(lines, { yPercent: 0, duration: 1.2, stagger: 0.12 })
        .to(chrome, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, "-=0.7");
    };

    if (window.__preloaderDone) {
      intro();
    } else {
      window.addEventListener("preloader:done", intro, { once: true });
    }

    return () => {
      window.removeEventListener("preloader:done", intro);
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={rootRef}>
      <HeroCanvas />
      <div className="hero__meta">
        <p className="label">
          Muzzamil Hassan — Full-Stack Developer
          <br className="hero__meta-br" />
          <span className="hero__meta-stack">MERN / PERN</span>
        </p>
        <p className="label">Portfolio ’26</p>
      </div>
      <div className="hero__inner">
        <h1 className="hero__title">
          <span className="hero__line">
            <span>From Schema</span>
          </span>
          <span className="hero__line">
            <span className="outline">To Screen</span>
          </span>
          <span className="hero__line">
            <span>
              Full-<em>Stack</em>
            </span>
          </span>
        </h1>
        <div className="hero__bottom">
          <p className="hero__tagline">
            React &amp; Next.js frontends, Node.js / NestJS APIs and the data
            layer underneath — <code>Postgres</code> or <code>Mongo</code>, I
            build and ship the whole thing.
          </p>
          <a href="#contact" className="hero__status">
            <span className="pulse" aria-hidden="true" />
            Open to work
          </a>
        </div>
      </div>
      <div className="hero__scroll">Scroll to explore</div>
    </section>
  );
}
