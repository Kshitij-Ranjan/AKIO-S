import { useRef } from "react";
import { useGSAP, gsap } from "../../lib/gsap";
import "../../styles/skills.css";

export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const bgRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const personRef = useRef<HTMLDivElement>(null);
  const type1Ref = useRef<HTMLDivElement>(null);
  const type2Ref = useRef<HTMLDivElement>(null);
  const type3Ref = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  
  const tool1Ref = useRef<HTMLDivElement>(null);
  const tool2Ref = useRef<HTMLDivElement>(null);
  const tool3Ref = useRef<HTMLDivElement>(null);
  const tool4Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 1025px)", () => {
      // 1. Cinematic Entrance Timeline (Sped up by 50%)
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      });

      revealTl.fromTo([bgRef.current, lightRef.current], 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.0, ease: "power2.out" }
      )
      .fromTo(detailRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
        "-=0.8"
      )
      // Typography
      .fromTo([type1Ref.current, type3Ref.current],
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.0, stagger: 0.15, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(type2Ref.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" },
        "-=0.8"
      )
      // Portrait reveals
      .fromTo(personRef.current, 
        { opacity: 0, y: 100, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: "power4.out" },
        "-=0.8"
      )
      // Tools enter asymmetrically
      .fromTo(tool1Ref.current, { opacity: 0, x: -60, y: -20 }, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .fromTo(tool2Ref.current, { opacity: 0, x: 60, y: -20 }, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .fromTo(tool3Ref.current, { opacity: 0, x: -60, y: 20 }, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .fromTo(tool4Ref.current, { opacity: 0, x: 60, y: 20 }, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5");

      // 2. Parallax Depth Timeline
      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      // Background textures move very slowly
      parallaxTl.to(bgRef.current, { yPercent: 10 }, 0)
                // Typography 
                .to(type1Ref.current, { yPercent: 15 }, 0)
                .to(type3Ref.current, { yPercent: 20 }, 0)
                .to(type2Ref.current, { yPercent: -5 }, 0)
                // Portrait 
                .to(personRef.current, { yPercent: -10 }, 0)
                // Tools (floating in 3D space)
                .to(tool1Ref.current, { yPercent: -30 }, 0)
                .to(tool2Ref.current, { yPercent: -40 }, 0)
                .to(tool3Ref.current, { yPercent: -20 }, 0)
                .to(tool4Ref.current, { yPercent: -35 }, 0);

      // 3. Exit Transition
      if (containerRef.current) {
        gsap.to(containerRef.current.children, {
          opacity: 0,
          y: -50,
          ease: "power2.in",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "bottom 40%",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    });
    
    mm.add("(max-width: 1024px)", () => {
       if (!containerRef.current) return;
       gsap.fromTo(containerRef.current.children, 
         { opacity: 0, y: 40 },
         { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
           scrollTrigger: {
             trigger: containerRef.current,
             start: "top 75%",
           }
         }
       );
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="skills" className="skills-cinematic" ref={containerRef}>
      
      {/* Background Cinematic Textures */}
      <div className="skills-cinematic__bg" ref={bgRef}></div>
      
      {/* Warm Cinematic Backlight */}
      <div className="skills-cinematic__light" ref={lightRef}></div>


      <div className="skills-cinematic__container">
        
        {/* Editorial Detail */}
        <div className="skills-cinematic__detail" ref={detailRef}>
          FIG. 01<br/>
          AKIO'S // TOOLS
        </div>

        {/* Typography Layer */}
        <div className="skills-cinematic__type skills-cinematic__type--1" ref={type1Ref}>
          THE TOOLS
        </div>
        <div className="skills-cinematic__type skills-cinematic__type--2" ref={type2Ref}>
          BEHIND
        </div>
        <div className="skills-cinematic__type skills-cinematic__type--3" ref={type3Ref}>
          THE WORK.
        </div>

        {/* Central Person */}
        <div className="skills-cinematic__person" ref={personRef}>
          <img src="/media/skills/Me_removedBackground.png" alt="Creative Editor" />
        </div>

        {/* Tools Layer (Liquid Glass) */}
        
        {/* Top Left: Premiere */}
        <div className="skills-cinematic__tool skills-cinematic__tool--pr" ref={tool1Ref}>
          <img src="/media/skills/Adobe_Premiere_Pro_icon.svg" alt="Premiere Pro" className="skills-cinematic__tool-icon" />
          <div className="skills-cinematic__tool-info">
            <span className="skills-cinematic__tool-name">Premiere Pro</span>
            <span className="skills-cinematic__tool-desc">VIDEO EDITING</span>
          </div>
        </div>

        {/* Top Right: Affinity */}
        <div className="skills-cinematic__tool skills-cinematic__tool--af" ref={tool2Ref}>
          <img src="/media/skills/Affinity_(App)_Logo.svg" alt="Affinity" className="skills-cinematic__tool-icon" />
          <div className="skills-cinematic__tool-info">
            <span className="skills-cinematic__tool-name">Affinity</span>
            <span className="skills-cinematic__tool-desc">GRAPHIC DESIGN</span>
          </div>
        </div>

        {/* Bottom Left: After Effects */}
        <div className="skills-cinematic__tool skills-cinematic__tool--ae" ref={tool3Ref}>
          <img src="/media/skills/Adobe_After_Effects_icon.svg" alt="After Effects" className="skills-cinematic__tool-icon" />
          <div className="skills-cinematic__tool-info">
            <span className="skills-cinematic__tool-name">After Effects</span>
            <span className="skills-cinematic__tool-desc">MOTION / VFX</span>
          </div>
        </div>

        {/* Bottom Right: DaVinci Resolve */}
        <div className="skills-cinematic__tool skills-cinematic__tool--dv" ref={tool4Ref}>
          <img src="/media/skills/DaVinci_Resolve_17_logo.svg" alt="DaVinci Resolve" className="skills-cinematic__tool-icon" />
          <div className="skills-cinematic__tool-info">
            <span className="skills-cinematic__tool-name">DaVinci Resolve</span>
            <span className="skills-cinematic__tool-desc">EDITING / COLOR</span>
          </div>
        </div>

      </div>
    </section>
  );
}
