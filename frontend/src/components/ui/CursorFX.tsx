import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Colors strictly tuned for a high-end cinematic/film-grain look
const DUST_COLORS = [
  '#080808', // Near-black (72% dark probability group)
  '#151515', // Charcoal
  '#242424', // Graphite
  '#383838', // Dark grey
  '#777777', // Muted silver (18% medium probability)
  '#AAAAAA', // Light grey
  '#E0DCD5', // Off-white (10% highlight probability)
  '#B9823F', // Muted amber (Rare)
];

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  isGlowing: boolean;

  constructor(x: number, y: number, vx: number, vy: number, isBurst = false) {
    this.x = x;
    this.y = y;
    
    // Increased base velocity for cinematic scattering
    const speedMult = isBurst ? 2.5 : 1.2;
    this.vx = vx * 0.15 + (Math.random() - 0.5) * 3 * speedMult;
    this.vy = vy * 0.15 + (Math.random() - 0.5) * 3 * speedMult;
    
    const sizeRoll = Math.random();
    if (sizeRoll > 0.95) {
      this.size = Math.random() * 3 + 4; // 4-7px cinematic accents
    } else if (sizeRoll > 0.7) {
      this.size = Math.random() * 2 + 2; // 2-4px main particles
    } else {
      this.size = Math.random() * 1 + 1; // 1-2px fine grains
    }
    
    // Lifetimes (500-1100ms ≈ 30-66 frames at 60fps)
    this.maxLife = Math.floor(Math.random() * 36 + 30);
    this.life = this.maxLife;
    this.isGlowing = false;
    
    const r = Math.random();
    if (r < 0.18) {
      this.color = DUST_COLORS[0]; // Near-black
    } else if (r < 0.36) {
      this.color = DUST_COLORS[1]; // Charcoal
    } else if (r < 0.54) {
      this.color = DUST_COLORS[2]; // Graphite
    } else if (r < 0.72) {
      this.color = DUST_COLORS[3]; // Dark grey
    } else if (r < 0.90) {
      this.color = DUST_COLORS[4]; // Muted silver
    } else if (r < 0.97) {
      this.color = DUST_COLORS[5]; // Light grey
    } else if (r < 0.985) {
      this.color = DUST_COLORS[6]; // Off-white
      if (Math.random() > 0.5) this.isGlowing = true;
    } else {
      this.color = DUST_COLORS[7]; // Muted amber
      if (Math.random() > 0.5) this.isGlowing = true;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Drag & turbulence
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.x += (Math.random() - 0.5) * 0.3; // organic jitter
    
    this.life--;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = alpha;
    
    if (this.isGlowing) {
      ctx.shadowBlur = this.size;
      ctx.shadowColor = this.color;
    } else {
      ctx.shadowBlur = 0;
    }
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function CursorFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // EXTREMELY IMPORTANT: Scale for retina/high-DPI displays!
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let particles: Particle[] = [];
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovering = false;
    let hoverState = 0; // Crossfade value (0 = black, 1 = golden-orange)
    let isActive = false;
    let distanceAccumulator = 0;
    let animationFrameId: number;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      // Re-apply scale after resize
      ctx.setTransform(1, 0, 0, 1, 0, 0); 
      ctx.scale(dpr, dpr);
    };

    const spawnParticles = (count: number, x: number, y: number, vx: number, vy: number, isBurst = false) => {
      const limit = isHovering ? 450 : 350; // High cap to allow a truly rich field
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, vx, vy, isBurst));
      }
      if (particles.length > limit) {
        particles.splice(0, particles.length - limit);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isActive) {
        ringX = mouseX;
        ringY = mouseY;
        isActive = true;
        return;
      }

      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      const dist = Math.sqrt(vx * vx + vy * vy);
      
      distanceAccumulator += dist;
      
      // Interpolate the exact position to avoid gaps in the trail on fast movement
      const emitThreshold = 4; // Check every 4 pixels
      if (distanceAccumulator > emitThreshold) {
        const segments = Math.floor(distanceAccumulator / emitThreshold);
        
        for (let i = 0; i < segments; i++) {
          const t = i / segments;
          const interpX = prevMouseX + vx * t;
          const interpY = prevMouseY + vy * t;
          
          const count = Math.floor(Math.random() * 3) + 2; 
          spawnParticles(count, interpX, interpY, vx, vy, false);
        }
        
        distanceAccumulator = distanceAccumulator % emitThreshold;
      }
    };

    const handleMouseDown = () => {
      spawnParticles(35, mouseX, mouseY, 0, 0, true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, select, [role="button"], .film-strip__viewport')) {
        isHovering = true;
      } else {
        isHovering = false;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly transition hover state for approx 200ms duration (0.08 per frame at 60fps)
      hoverState += isHovering ? 0.08 : -0.08;
      hoverState = Math.max(0, Math.min(1, hoverState));

      // Atmospheric Haze (Maintained for ambient cinematic feel)
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      const currentSpeed = Math.sqrt(dx * dx + dy * dy);
      
      if (isActive && currentSpeed > 5) {
        ctx.globalAlpha = Math.min(0.2, currentSpeed / 200);
        const haze = ctx.createRadialGradient(ringX, ringY, 0, ringX, ringY, 45);
        haze.addColorStop(0, 'rgba(36, 36, 36, 0.3)');
        haze.addColorStop(1, 'rgba(36, 36, 36, 0)');
        ctx.fillStyle = haze;
        ctx.beginPath();
        ctx.arc(ringX, ringY, 45, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }
      
      ctx.shadowBlur = 0;

      // Draw Luminous Cursor
      if (isActive) {
        ringX += dx * 0.25; // Slightly faster follow for precision
        ringY += dy * 0.25;

        // Draw Default Black Glow Layer
        if (hoverState < 1) {
          ctx.globalAlpha = 1 - hoverState;
          
          const blackRadius = 18;
          const blackGrad = ctx.createRadialGradient(ringX, ringY, 0, ringX, ringY, blackRadius);
          blackGrad.addColorStop(0, 'rgba(0, 0, 0, 1)'); // Deep black center
          blackGrad.addColorStop(0.5, 'rgba(30, 30, 30, 0.9)'); // Charcoal
          blackGrad.addColorStop(0.85, 'rgba(100, 100, 100, 0.35)'); // Subtle grey highlight
          blackGrad.addColorStop(1, 'rgba(120, 120, 120, 0)'); // Soft edge
          
          ctx.fillStyle = blackGrad;
          ctx.beginPath();
          ctx.arc(ringX, ringY, blackRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Interactive Golden-Orange Glow Layer
        if (hoverState > 0) {
          ctx.globalAlpha = hoverState;
          
          const orangeRadius = 28;
          const orangeGrad = ctx.createRadialGradient(ringX, ringY, 0, ringX, ringY, orangeRadius);
          orangeGrad.addColorStop(0, 'rgba(255, 240, 200, 1)');
          orangeGrad.addColorStop(0.25, 'rgba(217, 119, 54, 0.7)');
          orangeGrad.addColorStop(1, 'rgba(217, 119, 54, 0)');
          
          ctx.fillStyle = orangeGrad;
          ctx.beginPath();
          ctx.arc(ringX, ringY, orangeRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.globalAlpha = 1; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
