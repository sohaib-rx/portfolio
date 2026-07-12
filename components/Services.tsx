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
    desc: "Next.js App Router, Server Components and SSR/ISR — pixel-perfect from Figma, typed, a11y and SEO-ready.",
  },
  {
    name: "APIs & Backends",
    desc: "REST services in Node.js, Express and NestJS with JWT / OAuth2 auth and role-based access control.",
  },
  {
    name: "Data & Databases",
    desc: "PostgreSQL, MongoDB, MySQL and SQLite — schema design, Drizzle ORM and pluggable multi-DB adapters.",
  },
  {
    name: "Cloud & Delivery",
    desc: "Vercel CI/CD and Edge Functions, Docker and GitHub Actions that ship on every merge.",
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
