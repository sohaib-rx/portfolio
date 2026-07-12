"use client";

import { useEffect, useState } from "react";

function toggleTheme() {
  const root = document.documentElement;
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = root.dataset.theme || (dark ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

export default function Nav() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Karachi",
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="nav">
      <a href="#top" className="nav__logo">
        sohaib<span className="accent">.dev</span>
      </a>
      <nav className="nav__links" aria-label="Main">
        <span className="nav__time" suppressHydrationWarning>
          PKT {time}
        </span>
        <a className="nav__link" href="#work">
          Work
        </a>
        <a className="nav__link" href="#about">
          About
        </a>
        <a className="nav__link" href="#contact">
          Contact
        </a>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
        >
          <svg className="icon-moon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
          <svg className="icon-sun" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
