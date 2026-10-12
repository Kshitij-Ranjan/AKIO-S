import { useEffect, useRef } from 'react';
import { useGSAP, gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

// @ts-ignore
import bgImage from "../../../../../Skillsrc/background_extra.jpeg";
// @ts-ignore
import portrait from "../../../../../Skillsrc/Me_removedBackground.png";

import './about.css';

export function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();

  useGSAP(() => {
    if (prefersReducedMotion) return;

    gsap.fromTo(".about-page__reveal", 
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        stagger: 0.15, 
        ease: "power3.out"
      }
    );
  }, [prefersReducedMotion]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/contact');
  };

  return (
    <div className="about-page" ref={containerRef}>
      {/* Background layer shared with home */}
      <div 
        aria-hidden="true" 
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.4,
          pointerEvents: "none"
        }}
      />
      
      <div className="container about-page__container">
        <header className="about-page__header about-page__reveal">
          <h1 className="section__heading about-page__heading">BEHIND THE FRAME</h1>
          <p className="about-page__intro">
            I am a cinematic video editor specializing in narrative storytelling, commercials, and music videos.
          </p>
        </header>

        <div className="about-page__grid">
          <div className="about-page__portrait about-page__reveal">
            <img 
              src={portrait} 
              alt="Akio - Video Editor" 
              className="about-page__image"
            />
          </div>
          
          <div className="about-page__content">
            <section className="about-page__section about-page__reveal">
              <h2 className="about-page__subheading">My Approach</h2>
              <p className="about-page__text">
                My work focuses on rhythm, emotion, and precision. I believe that editing is the final rewrite of a film—where pacing, sound, and visual flow converge to shape a cohesive narrative.
              </p>
            </section>
            
            <section className="about-page__section about-page__reveal">
              <h2 className="about-page__subheading">Creative Philosophy</h2>
              <p className="about-page__text">
                Every frame must serve a purpose. Whether it is a hard cut to disrupt momentum or a lingering shot to let an emotion breathe, my goal is to guide the audience invisibly through the story.
              </p>
              <p className="about-page__text">
                Sound design and color grading are never afterthoughts; they are integral to how I build atmosphere and tension from the very first assembly.
              </p>
            </section>

            <section className="about-page__section about-page__reveal">
              <h2 className="about-page__subheading">The Craft</h2>
              <p className="about-page__tools">
                Premiere Pro / After Effects / DaVinci Resolve / Affinity
              </p>
            </section>
          </div>
        </div>

        <div className="about-page__cta about-page__reveal">
          <h2 className="about-page__cta-heading">Ready to collaborate?</h2>
          <Button variant="outline" onClick={handleContactClick}>
            Discuss a Project
          </Button>
        </div>
      </div>
    </div>
  );
}
