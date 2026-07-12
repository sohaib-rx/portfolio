"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-line > span").forEach((span, i) => {
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
        <p className="label contact__kicker">Got a product to build?</p>
        <h2 className="contact__title">
          <span className="reveal-line">
            <span>Let’s ship</span>
          </span>
          <span className="reveal-line">
            <span>
              something <span className="outline">solid</span>
            </span>
          </span>
        </h2>
        <a className="contact__email" href="mailto:muzzamilhassan302@gmail.com">
          muzzamilhassan302@gmail.com
        </a>
      </div>
      <div className="footer">
        <span>© 2026 Muzzamil Hassan — Built with Next.js</span>
        <div className="footer__socials">
          <a href="https://github.com/muzzamilhassan" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com/in/muzzamilhassan" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:muzzamilhassan302@gmail.com">Email</a>
        </div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
