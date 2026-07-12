"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Project = {
  name: string;
  desc: string;
  chips: string[];
  image: string;
};

const PROJECTS: Project[] = [
  {
    name: "Nextly",
    desc: "TypeScript-first headless CMS framework inside Next.js — code-defined schemas plus a drag-and-drop visual builder, RBAC, and pluggable Postgres/MySQL/SQLite adapters.",
    chips: ["Next.js", "TypeScript", "Drizzle ORM", "Docker"],
    image: "/projects/nextly.svg",
  },
  {
    name: "RextAI",
    desc: "AI content-intelligence SaaS with an E-E-A-T-aware article editor and one-click auto-publish to WordPress, Webflow and Ghost.",
    chips: ["Next.js", "LangChain", "OpenAI", "Node.js"],
    image: "/projects/rextai.svg",
  },
  {
    name: "HireIQ",
    desc: "AI-powered recruitment and candidate-evaluation platform built on LangGraph agent workflows.",
    chips: ["Next.js", "TypeScript", "LangGraph", "OpenAI"],
    image: "/projects/hireiq.svg",
  },
  {
    name: "4Rivers Equipment",
    desc: "Enterprise e-commerce and equipment-rental platform with Stripe checkout and Google Maps location search.",
    chips: ["Next.js", "Redux Toolkit", "Stripe", "Google Maps"],
    image: "/projects/4rivers.svg",
  },
];

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(rootRef);

    // must match the @media block in globals.css exactly
    mm.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;

        const distance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self: ScrollTrigger) => {
              if (fillRef.current) {
                fillRef.current.style.transform = `scaleX(${self.progress})`;
              }
              if (countRef.current) {
                const idx =
                  Math.round(self.progress * (PROJECTS.length - 1)) + 1;
                countRef.current.textContent = `0${idx}`;
              }
            },
          },
        });

        gsap.from(".section__title > span", {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: pin, start: "top 80%" },
        });
      }
    );

    mm.add(
      "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.utils.toArray<HTMLElement>(".panel").forEach((panel) => {
          gsap.from(panel, {
            y: 70,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 88%" },
          });
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="showcase" id="work" ref={rootRef}>
      <div className="showcase__pin" ref={pinRef}>
        <div className="showcase__head">
          <h2 className="section__title">
            <span>
              Selected <span className="accent">Builds</span>
            </span>
          </h2>
          <p className="showcase__count">
            <em ref={countRef}>01</em> — 0{PROJECTS.length}
          </p>
        </div>
        <div className="showcase__track" ref={trackRef}>
          {PROJECTS.map((project, i) => (
            <article className="panel" key={project.name}>
              <div className="panel__info">
                <span className="panel__num" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="panel__name">{project.name}</h3>
                <p className="panel__desc">{project.desc}</p>
                <div className="panel__chips">
                  {project.chips.map((chip) => (
                    <span className="chip" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>
                <a className="panel__link" href="#contact">
                  View case study →
                </a>
              </div>
              <div className="panel__media">
                <img
                  src={project.image}
                  alt={`${project.name} — screenshot`}
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>
        <div className="showcase__progress" aria-hidden="true">
          <i ref={fillRef} />
        </div>
      </div>
    </section>
  );
}
