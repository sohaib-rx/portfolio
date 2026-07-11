"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Amsterdam",
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
        AV<span aria-hidden="true">©</span>
      </a>
      <nav className="nav__links" aria-label="Main">
        <span className="nav__time" suppressHydrationWarning>
          AMS {time}
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
      </nav>
    </header>
  );
}
