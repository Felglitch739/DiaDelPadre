import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const tl = anime.timeline({
      complete: () => {
        setIsVisible(false);
        onComplete();
      }
    });

    // Fade in the text
    tl.add({
      targets: textRef.current,
      opacity: [0, 1],
      duration: 1500,
      easing: "easeInOutQuad",
    });

    // Hold it for a moment
    tl.add({
      targets: textRef.current,
      opacity: 1,
      duration: 1500,
    });

    // Fade out text and background
    tl.add({
      targets: containerRef.current,
      opacity: [1, 0],
      duration: 1500,
      easing: "easeInOutQuad",
    });

  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 pointer-events-none"
    >
      <p 
        ref={textRef}
        className="text-zinc-400 font-light tracking-[0.3em] uppercase text-sm opacity-0"
      >
        Cargando recuerdos...
      </p>
    </div>
  );
}
