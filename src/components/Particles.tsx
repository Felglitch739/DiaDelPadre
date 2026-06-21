"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";

interface ParticlesProps {
  count?: number;
  color?: string;
  isActive?: boolean;
}

export default function Particles({ count = 40, color = "bg-amber-500", isActive = true }: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [configs, setConfigs] = useState<{ width: string; height: string; left: string }[]>([]);

  useEffect(() => {
    // Generate initial styles in effect to avoid React hydration errors (Math.random is impure)
    // Wrapped in setTimeout to prevent "synchronous setState in effect" lint error
    const timer = setTimeout(() => {
      setConfigs(
        Array.from({ length: count }).map(() => ({
          width: Math.random() * 6 + 2 + "px",
          height: Math.random() * 6 + 2 + "px",
          left: Math.random() * 100 + "vw",
        }))
      );
    }, 0);
    return () => clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    if (configs.length === 0 || !containerRef.current) return;

    const particles = containerRef.current.querySelectorAll(".particle");

    if (isActive) {
      anime({
        targets: particles,
        translateY: () => [anime.random(20, 100) + "vh", anime.random(-100, -120) + "vh"],
        translateX: () => [anime.random(-20, 20) + "vw", anime.random(-50, 50) + "vw"],
        scale: () => [0, anime.random(0.5, 1.5)],
        opacity: () => [0, anime.random(0.2, 0.8), 0],
        duration: () => anime.random(10000, 20000),
        delay: () => anime.random(0, 2000),
        easing: "linear",
        loop: true,
      });
    } else {
      anime.remove(particles);
    }
    
    return () => anime.remove(particles);
  }, [isActive, configs.length]);

  if (configs.length === 0) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {configs.map((config, i) => (
        <div
          key={i}
          className={`particle absolute rounded-full ${color} mix-blend-screen shadow-[0_0_10px_rgba(245,158,11,0.5)]`}
          style={{
            ...config,
            bottom: "-10vh",
          }}
        />
      ))}
    </div>
  );
}
