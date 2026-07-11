"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const PROJECTS = [
  {
    name: "Cartly",
    tags: "E-commerce · MERN + Stripe",
    year: "2026",
    art: "linear-gradient(135deg, #065f46 0%, #10b981 55%, #a7f3d0 100%)",
  },
  {
    name: "Ledgr",
    tags: "Invoicing SaaS · PERN",
    year: "2025",
    art: "linear-gradient(140deg, #1e3a8a 0%, #3b82f6 55%, #a5f3fc 100%)",
  },
  {
    name: "Pulse",
    tags: "Realtime Analytics · Next.js + Socket.io",
    year: "2025",
    art: "linear-gradient(130deg, #9a3412 0%, #f97316 50%, #fde68a 100%)",
  },
  {
    name: "Stacko",
    tags: "Team Kanban · PERN + tRPC",
    year: "2024",
    art: "linear-gradient(145deg, #581c87 0%, #a855f7 50%, #f0abfc 100%)",
  },
];

export default function Work() {
  const rootRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".section__title > span").forEach((span) => {
        gsap.from(span, {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: span, start: "top 88%" },
        });
      });

      gsap.utils.toArray(".project").forEach((card) => {
        gsap.from(card, {
          y: 80,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });

        const art = card.querySelector(".project__art");
        gsap.fromTo(
          art,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="work" ref={rootRef}>
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">
            <span>
              Selected <span className="accent">Builds</span>
            </span>
          </h2>
          <p className="label">Full-stack · 2024 — 2026</p>
        </div>
        <div className="work__grid">
          {PROJECTS.map((project, i) => (
            <a href="#contact" className="project" key={project.name}>
              <div className="project__media">
                <div className="project__art" style={{ background: project.art }} />
                <span className="project__num">
                  {String(i + 1).padStart(2, "0")} / {project.year}
                </span>
                <div className="project__mock" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="project__info">
                <h3 className="project__name">{project.name}</h3>
                <p className="project__tags">{project.tags}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
