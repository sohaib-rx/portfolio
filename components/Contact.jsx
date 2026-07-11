"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Contact() {
  const rootRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal-line > span").forEach((span, i) => {
        gsap.from(span, {
          yPercent: 110,
          duration: 1,
          delay: i * 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: ".contact__title", start: "top 82%" },
        });
      });

      gsap.from(".contact__email", {
        autoAlpha: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact__email", start: "top 92%" },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="contact" id="contact" ref={rootRef}>
      <div className="container">
        <p className="label contact__kicker">Got a project in mind?</p>
        <h2 className="contact__title">
          <span className="reveal-line">
            <span>Let’s make</span>
          </span>
          <span className="reveal-line">
            <span>
              something <span className="outline">rare</span>
            </span>
          </span>
        </h2>
        <a className="contact__email" href="mailto:hello@amaravoss.studio">
          hello@amaravoss.studio
        </a>
      </div>
      <div className="footer">
        <span>© 2026 Amara Voss — All rights reserved</span>
        <div className="footer__socials">
          <a href="#top">Dribbble</a>
          <a href="#top">Behance</a>
          <a href="#top">LinkedIn</a>
          <a href="#top">X</a>
        </div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
