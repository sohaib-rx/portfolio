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
    name: "Cartly",
    desc: "Headless e-commerce platform with cart, checkout and subscription billing — 40k orders processed in year one.",
    chips: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "/projects/cartly.svg",
  },
  {
    name: "Ledgr",
    desc: "Multi-tenant invoicing SaaS with role-based access, PDF pipelines and bank-grade audit logs.",
    chips: ["PostgreSQL", "Express", "React", "Node.js"],
    image: "/projects/ledgr.svg",
  },
  {
    name: "Pulse",
    desc: "Realtime analytics dashboards streaming a million events a day over websockets.",
    chips: ["Next.js", "Socket.io", "Redis", "Timescale"],
    image: "/projects/pulse.svg",
  },
  {
    name: "Stacko",
    desc: "Kanban for engineering teams with end-to-end type safety, from database rows to drag-and-drop.",
    chips: ["PERN", "tRPC", "Prisma", "Docker"],
    image: "/projects/stacko.svg",
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
