
import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    
    gsap.fromTo(
      container.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay }
    );
  }, { scope: container });

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  );
}
