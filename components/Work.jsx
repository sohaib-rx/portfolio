"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const PROJECTS = [
  {
    name: "Lumen",
    tags: "Fintech · Product Design",
    year: "2026",
    art: "linear-gradient(135deg, #4338ca 0%, #7c3aed 45%, #2dd4bf 100%)",
  },
  {
    name: "Aether",
    tags: "Spatial Audio · Brand & Web",
    year: "2025",
    art: "linear-gradient(140deg, #b91c1c 0%, #f97316 55%, #fde68a 100%)",
  },
  {
    name: "Nokta",
    tags: "SaaS · Design System",
    year: "2025",
    art: "linear-gradient(130deg, #064e3b 0%, #059669 50%, #a7f3d0 100%)",
  },
  {
    name: "Orbi",
    tags: "Travel · Mobile App",
    year: "2024",
    art: "linear-gradient(145deg, #9d174d 0%, #ec4899 50%, #fbbf24 100%)",
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
              Selected <span className="accent">Work</span>
            </span>
          </h2>
          <p className="label">2024 — 2026</p>
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
