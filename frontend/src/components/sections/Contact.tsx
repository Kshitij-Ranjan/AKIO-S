import { useRef } from 'react';
import { Link } from "react-router-dom";
import { useGSAP, gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// @ts-ignore
import phoneImage from '../../../../../Skillsrc/Vintage_phone.png';

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const phoneInnerRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const psRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "center center",
        scrub: 1,
      }
    });

    // 1. Divider line draws from left to right
    tl.fromTo(lineRef.current, 
      { scaleX: 0, transformOrigin: "left center", opacity: 0 },
      { scaleX: 1, opacity: 1, ease: "none" },
      0
    );

    // 2. Telephone drops downward (inside clipping mask)
    tl.fromTo(phoneInnerRef.current,
      { y: "-100%", opacity: 0 },
      { y: "-15%", opacity: 1, ease: "none" },
      0.1
    );

    // 3. Text fades in and slides slightly
    tl.fromTo(textRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, ease: "none" },
      0.2
    );

    // 4. PS Text fades up
    tl.fromTo(psRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, ease: "none" },
      0.3
    );

  }, { scope: sectionRef, dependencies: [prefersReducedMotion] });

  return (
    <section id="contact" className="contact section" ref={sectionRef}>
      <div className="container contact-v4-container">
        
        {/* Divider Line */}
        <div className="contact-v4-divider-wrapper">
          <div className="contact-v4-divider" ref={lineRef}></div>
        </div>

        <div className="contact-v4-content">
          {/* Telephone Clipping Wrapper */}
          <div className="contact-v4-phone-wrapper">
            <Link 
              to="/contact" 
              className="contact-v4-link"
              aria-label="Discuss a project"
              ref={phoneInnerRef}
            >
              <img 
                src={phoneImage} 
                alt="Vintage Telephone" 
                className="contact-v4-image"
              />
            </Link>
          </div>

          {/* Contact Copy */}
          <div className="contact-v4-text-container">
            <div className="contact-v4-text" ref={textRef}>
              <h2 className="contact-v4-heading">
                YOUR VISION.<br />MY CUT.
              </h2>
              <p className="contact-v4-subtext">
                Have a project in mind? Let's bring your vision to life, one frame at a time.
              </p>
            </div>
            
            <p className="contact-v4-ps" ref={psRef}>
              P.S. The telephone won't call itself. <span className="contact-v4-ps-highlight">Give it a click.</span>
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
}
