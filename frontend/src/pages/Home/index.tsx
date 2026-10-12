// @ts-ignore
import bgImage from "../../../../../Skillsrc/background_extra.jpeg";
import { Hero } from "../../components/sections/Hero";

import { FilmStrip } from "../../components/sections/FilmStrip";
import { About } from "../../components/sections/About";
import { Skills } from "../../components/sections/Skills";
import { Services } from "../../components/sections/Services";
import { Contact } from "../../components/sections/Contact";

export function Home() {
  return (
    <>
      <Hero />
      <div className="home-content" style={{ position: "relative" }}>
        {/* Shared continuous page background */}
        <div 
          aria-hidden="true" 
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: `url("${bgImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            pointerEvents: "none"
          }}
        />

        {/* Content wrapper to sit above background */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Skills />
          <FilmStrip />
          <About />
          <Services />
          <Contact />
        </div>
      </div>
    </>
  );
}
