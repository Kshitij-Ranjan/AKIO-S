import { useRef } from "react";
import { useGSAP, gsap } from "../../lib/gsap";
import { SplitText } from "../animations/SplitText";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current || !bgRef.current || !contentRef.current) return;

    // Parallax hero content
    gsap.to(contentRef.current, {
      y: "30vh",
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // Subtle background recession
    gsap.to(bgRef.current, {
      scale: 0.95,
      opacity: 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });
  }, { scope: heroRef });

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__bg" ref={bgRef}>
        <video 
          src="/api/projects/media/heroBackground.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="hero__content" ref={contentRef}>
        <div className="hero__title-wrapper">
          <img 
            src="/media/hero/AKIO_font.png" 
            alt="AKIO'S" 
            className="hero__title-image" 
          />
        </div>
        <div className="hero__subtitle">
          <SplitText text="Cinematic Video Editor" delay={0.2} />
          <SplitText text="India" delay={0.4} />
        </div>
      </div>
    </section>
  );
}
