"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";

interface BackgroundGridProps {
  isActive: boolean;
}

export default function BackgroundGrid({ isActive }: BackgroundGridProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("path");

    if (isActive) {
      anime({
        targets: paths,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "easeInOutSine",
        duration: 3000,
        delay: anime.stagger(100, { grid: [10, 10], from: "center" }),
        opacity: [0, 0.2],
      });
    } else {
      anime.set(paths, { opacity: 0 });
    }
  }, [isActive]);

  // Generate a simple grid of lines
  const lines = [];
  for (let i = 0; i < 20; i++) {
    lines.push(<path key={`h-${i}`} d={`M0,${i * 50} L1000,${i * 50}`} stroke="currentColor" strokeWidth="1" fill="none" className="opacity-0" />);
    lines.push(<path key={`v-${i}`} d={`M${i * 50},0 L${i * 50},1000`} stroke="currentColor" strokeWidth="1" fill="none" className="opacity-0" />);
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        className="w-[200vw] h-[200vh] text-zinc-800 md:w-[150vw] md:h-[150vh]"
        preserveAspectRatio="xMidYMid slice"
      >
        {lines}
      </svg>
    </div>
  );
}
