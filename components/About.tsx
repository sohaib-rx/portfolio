"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const TEXT =
  "I'm Muzzamil — a full-stack developer with 3+ years shipping production web apps end to end on the JavaScript / TypeScript stack. React & Next.js on the front, Node.js, Express and NestJS on the back. I've built SaaS platforms, headless CMS systems and e-commerce for real clients — from the first migration to the final deploy.";

type Stat = {
  value: number;
  suffix: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 3, suffix: "+", label: "Years of experience" },
  { value: 7, suffix: "", label: "Products shipped" },
  { value: 5, suffix: "", label: "Databases in production" },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".about__text .word", { opacity: 1 });
        return;
      }

      gsap.to(".about__text .word", {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: ".about__text",
          start: "top 78%",
          end: "bottom 45%",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".stat__value").forEach((el) => {
        const target = Number(el.dataset.value);
        const suffix = el.dataset.suffix || "";
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = Math.round(counter.value) + suffix;
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="about" ref={rootRef}>
      <div className="container">
        <p className="label" style={{ marginBottom: "2rem" }}>
          About — <span className="accent">$ whoami</span>
        </p>
        <p className="about__text">
          {TEXT.split(" ").map((word, i) => (
            <span key={i}>
              <span className="word">{word}</span>{" "}
            </span>
          ))}
        </p>
      </div>
      <div className="about__stats">
        {STATS.map((stat) => (
          <div className="stat" key={stat.label}>
            <div
              className="stat__value"
              data-value={stat.value}
              data-suffix={stat.suffix}
            >
              0{stat.suffix}
            </div>
            <div className="stat__label label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
