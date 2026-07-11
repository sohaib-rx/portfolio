"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type Service = {
  name: string;
  desc: string;
};

const SERVICES: Service[] = [
  {
    name: "Frontend Engineering",
    desc: "React & Next.js apps — accessible, fast, and typed end to end.",
  },
  {
    name: "APIs & Backends",
    desc: "REST and GraphQL services in Node.js/Express that stay up under load.",
  },
  {
    name: "Data & Databases",
    desc: "PostgreSQL and MongoDB schema design, queries and migrations.",
  },
  {
    name: "DevOps & Delivery",
    desc: "Docker, CI/CD pipelines and cloud deploys that ship on every merge.",
  },
];

export default function Services() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".service").forEach((row, i) => {
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
              What I <span className="accent">ship</span>
            </span>
          </h2>
          <p className="label">The stack, covered</p>
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
