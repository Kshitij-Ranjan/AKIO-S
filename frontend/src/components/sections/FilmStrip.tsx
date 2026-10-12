import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP, gsap, Draggable } from "../../lib/gsap";
import { useProjects } from "../../hooks/useProjects";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/utils";

export function FilmStrip() {
  const { data: projects, status } = useProjects();
  const prefersReducedMotion = useReducedMotion();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const speedScaleRef = useRef(1);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  
  const navigate = useNavigate();

  // 1. Setup Infinite Marquee + Draggable
  useGSAP(() => {
    if (prefersReducedMotion || status !== "loaded" || projects.length === 0 || !trackRef.current || !scrollWrapperRef.current) return;

    const trackWidth = trackRef.current.offsetWidth;
    const wrapX = gsap.utils.wrap(-trackWidth, 0);

    // Initial position
    gsap.set(scrollWrapperRef.current, { x: 0 });

    const baseSpeed = 80; // px per second
    
    const tick = (_time: number, deltaTime: number) => {
      if (!isDraggingRef.current) {
        const currentX = gsap.getProperty(scrollWrapperRef.current, "x") as number;
        // delta in pixels based on time and speed scale
        const delta = (baseSpeed * (deltaTime / 1000)) * speedScaleRef.current;
        gsap.set(scrollWrapperRef.current, { x: wrapX(currentX - delta) });
      }
    };

    gsap.ticker.add(tick);

    const draggable = Draggable.create(scrollWrapperRef.current, {
      type: "x",
      trigger: scrollWrapperRef.current,
      dragClickables: true, // Allow clicking on project links
      liveSnap: {
        x: (value) => wrapX(value)
      },
      onPress() {
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
      },
      onDragStart() {
        hasDraggedRef.current = true;
      },
      onRelease() {
        isDraggingRef.current = false;
        // Prevent click if we dragged
        setTimeout(() => { hasDraggedRef.current = false; }, 50);
      }
    });

  return () => {
      gsap.ticker.remove(tick);
      if (draggable[0]) draggable[0].kill();
    };
  }, [status, projects.length, prefersReducedMotion]);

  const handleMouseEnter = () => {
    if (!prefersReducedMotion) gsap.to(speedScaleRef, { current: 0.2, duration: 0.5 });
  };
  
  const handleMouseLeave = () => {
    if (!prefersReducedMotion) gsap.to(speedScaleRef, { current: 1, duration: 0.5 });
  };

  // 2. Project Selection Transition
  const handleProjectClick = (e: React.MouseEvent | null, slug: string, itemElement?: HTMLElement) => {
    if (hasDraggedRef.current) {
      if (e) e.preventDefault();
      return;
    }
    
    if (e) e.preventDefault();
    
    if (prefersReducedMotion) {
      navigate(`/projects/${slug}`);
      return;
    }

    try {
      const targetItem = itemElement || (e?.currentTarget as HTMLElement);
      const poster = targetItem.querySelector(".film-strip__poster") as HTMLElement;
      
      if (!poster) throw new Error("Poster not found");

      const rect = poster.getBoundingClientRect();
      const clone = poster.cloneNode(true) as HTMLElement;
      clone.classList.add("project-transition-clone");
      gsap.set(clone, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        margin: 0,
        position: "fixed"
      });
      document.body.appendChild(clone);

      const overlay = document.createElement("div");
      overlay.classList.add("project-transition-overlay");
      document.body.appendChild(overlay);

      const tl = gsap.timeline({
        onComplete: () => {
          navigate(`/projects/${slug}`);
          setTimeout(() => {
            if (document.body.contains(clone)) document.body.removeChild(clone);
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
          }, 500);
        }
      });

      tl.to(overlay, { opacity: 1, duration: 0.4, ease: "power2.inOut" }, 0)
        .to(clone, {
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          duration: 0.8,
          ease: "power4.inOut"
        }, 0)
        .to(containerRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0);

    } catch (err) {
      console.error(err);
      navigate(`/projects/${slug}`);
    }
  };

  const renderTrack = (ref?: React.RefObject<HTMLDivElement | null>) => (
    <div className={cn(prefersReducedMotion ? "film-strip__static-grid" : "film-strip__marquee-track")} ref={ref}>
      {projects.map((p, i) => (
        <a 
          href={`/projects/${p.slug}`}
          onClick={(e) => handleProjectClick(e, p.slug)}
          key={`${p.id}-${i}`} 
          className="film-strip__item"
          tabIndex={0}
        >
          <div className="film-strip__poster" style={{ overflow: 'hidden', position: 'relative' }}>
            {p.posterUrl ? (
              <img 
                src={p.posterUrl} 
                alt={p.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <span className="film-strip__poster-title">{p.title}</span>
            )}
            {p.videoUrl && (
              <video 
                src={p.videoUrl}
                muted 
                loop 
                playsInline 
                onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                onMouseLeave={(e) => {
                  const v = e.target as HTMLVideoElement;
                  v.pause();
                  v.currentTime = 0;
                }}
                style={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0, transition: 'opacity 0.3s'
                }}
                onPlay={(e) => (e.target as HTMLVideoElement).style.opacity = '1'}
                onPause={(e) => (e.target as HTMLVideoElement).style.opacity = '0'}
              />
            )}
          </div>
          <h3 className="film-strip__title">{p.title}</h3>
        </a>
      ))}
    </div>
  );

  return (
    <section 
      id="work" 
      className="film-strip project-stage-container section" 
      ref={containerRef}
      aria-label="Project portfolio continuous scroll"
      style={{ position: "relative" }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="section__heading mb-8">The Work In Motion</h2>
      </div>
      
      {status === "loading" && <div className="film-strip__state" style={{ position: "relative", zIndex: 1 }}>Loading projects...</div>}
      {status === "error" && <div className="film-strip__state" style={{ position: "relative", zIndex: 1 }}>Failed to load projects.</div>}
      {status === "empty" && <div className="film-strip__state" style={{ position: "relative", zIndex: 1 }}>No projects available yet.</div>}
      
      {status === "loaded" && (
        <div 
          className="film-strip__viewport" 
          style={{ overflow: 'hidden', padding: prefersReducedMotion ? '0 1.5rem' : '0', cursor: prefersReducedMotion ? 'auto' : 'grab', position: "relative", zIndex: 1 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {prefersReducedMotion ? (
            renderTrack()
          ) : (
            <div className="film-strip__marquee-wrapper" ref={scrollWrapperRef}>
              {renderTrack(trackRef)}
              {renderTrack()}
              {renderTrack()}
              {renderTrack()}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
