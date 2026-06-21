"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import SplitText from "../SplitText";
import BackgroundGrid from "../BackgroundGrid";

interface SlideProps {
  isActive: boolean;
}

export default function Slide1({ isActive }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const headlineChars = containerRef.current.querySelectorAll("h1 .split-char");

    if (isActive) {
      const tl = anime.timeline();

      // Phase 1: Cinematic Ken Burns effect
      // Starts huge, blurred and invisible -> fades in bright, becomes sharp, and zooms out slowly
      tl.add({
        targets: bgImageRef.current,
        opacity: [0, 0.65],
        scale: [1.5, 1.05],   // Never go below 1.0 to prevent ugly background gaps
        filter: ["blur(20px)", "blur(0px)"],
        duration: 4500,
        easing: "easeOutCubic",
      }, 0);

      // Phase 2: Text appears while the image is still settling
      tl.add({
        targets: headlineChars,
        translateY: ["100%", "0%"],
        translateZ: [100, 0],
        rotateX: [-90, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: anime.stagger(50, { start: 500 }),
        easing: "easeOutElastic(1, .6)",
      }, 800);

      tl.add({
        targets: subtitleRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: "easeOutExpo",
      }, "-=800");

      tl.add({
        targets: indicatorRef.current,
        opacity: [0, 1],
        duration: 1000,
        easing: "easeOutExpo",
      }, "-=400");

      // Looping bounce on scroll indicator
      anime({
        targets: indicatorRef.current,
        translateY: [0, 10, 0],
        duration: 2000,
        easing: "easeInOutSine",
        loop: true,
      });

    } else {
      anime.set([headlineChars, subtitleRef.current, indicatorRef.current, bgImageRef.current], {
        opacity: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
      });
      anime.remove(indicatorRef.current);
    }
  }, [isActive]);

  return (
    <div ref={containerRef} className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      
      {/* Background SVG Grid */}
      <BackgroundGrid isActive={isActive} />

      {/* Background image — same as before but with more impactful animation */}
      <div ref={bgImageRef} className="absolute inset-0 z-0 opacity-0 mix-blend-luminosity will-change-transform">
        <Image 
          src="/photos/youngerDad.jpg" 
          alt="Dad" 
          fill 
          className="object-contain md:object-cover grayscale"
          style={{ objectPosition: "center 30%" }}
          priority
        />
        {/* Gradient vignette — lighter than before so the face shows through */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_40%,transparent_30%,rgba(9,9,11,0.75)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-zinc-950 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-zinc-950 to-transparent" />
      </div>

      {/* Text */}
      <div className="z-10 perspective-[1000px]">
        <h1 
          ref={headlineRef} 
          className="text-5xl md:text-8xl font-black tracking-tighter text-amber-100 mb-6 drop-shadow-2xl"
        >
          <SplitText>Para el motor de esta familia.</SplitText>
        </h1>
        <p 
          ref={subtitleRef} 
          className="text-2xl md:text-4xl text-zinc-400 font-light opacity-0 tracking-wide"
        >
          Feliz Día del Padre.
        </p>
      </div>
      
      <div 
        ref={indicatorRef} 
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2 opacity-0 text-amber-500/70"
      >
        <span className="text-sm font-medium tracking-widest uppercase">Desliza</span>
        <ChevronDown size={24} />
      </div>
    </div>
  );
}
