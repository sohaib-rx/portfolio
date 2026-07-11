import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee
          items={["Interfaces", "Motion", "Design Systems", "Prototypes", "Art Direction"]}
        />
        <Work />
        <About />
        <Services />
        <Marquee
          accent
          items={["Open for collaborations", "Freelance 2026", "Open for collaborations", "Freelance 2026"]}
        />
        <Contact />
      </main>
    </>
  );
}
