"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const SERVICES = [
  {
    name: "Product Design",
    desc: "From messy brief to shippable product — research, UX flows, UI craft.",
  },
  {
    name: "Interaction & Motion",
    desc: "Micro-interactions and motion language that make interfaces feel alive.",
  },
  {
    name: "Design Systems",
    desc: "Scalable component libraries and tokens your team will actually use.",
  },
  {
    name: "Creative Direction",
    desc: "Visual identity, art direction and campaigns for digital-first brands.",
  },
];

export default function Services() {
  const rootRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".service").forEach((row, i) => {
        gsap.from(row, {
          y: 50,
          autoAlpha: 0,
          duration: 0.8,
          delay: (i % 4) * 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 92%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section" ref={rootRef} aria-label="Services">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">
            <span>
              What I <span className="accent">do</span>
            </span>
          </h2>
          <p className="label">Capabilities</p>
        </div>
      </div>
      <div>
        {SERVICES.map((service, i) => (
          <div className="service" key={service.name}>
            <span className="service__num">0{i + 1}</span>
            <h3 className="service__name">{service.name}</h3>
            <p className="service__desc">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
