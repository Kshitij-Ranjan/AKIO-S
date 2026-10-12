import { useRef } from "react";
import { useGSAP, gsap } from "../../lib/gsap";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function SplitText({ text, className, delay = 0 }: SplitTextProps) {
  const container = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useGSAP(() => {
    if (!container.current) return;
    
    gsap.fromTo(
      ".split-word",
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.8, ease: "power4.out", stagger: 0.05, delay }
    );
  }, { scope: container });

  return (
    <div ref={container} className={`split-text ${className || ''}`}>
      {words.map((word, i) => (
        <span key={i} className="split-word">
          {word}
        </span>
      ))}
    </div>
  );
}
