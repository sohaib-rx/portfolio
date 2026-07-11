"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const TEXT =
  "I'm Amara — a designer who believes great products are felt before they are understood. For eight years I've helped startups and studios turn complex problems into interfaces that feel effortless, expressive and alive.";

const STATS = [
  { value: 8, suffix: "", label: "Years of practice" },
  { value: 46, suffix: "+", label: "Projects shipped" },
  { value: 12, suffix: "", label: "Design awards" },
];

export default function About() {
  const rootRef = useRef(null);

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

      gsap.utils.toArray(".stat__value").forEach((el) => {
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
          About — The short version
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
