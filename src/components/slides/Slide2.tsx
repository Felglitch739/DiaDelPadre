"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import Image from "next/image";
import SplitText from "../SplitText";
import TiltPhoto from "../TiltPhoto";

interface SlideProps {
  isActive: boolean;
  onPhotoClick: (src: string) => void;
}

export default function Slide2({ isActive, onPhotoClick }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const svgPillarRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !photosRef.current) return;
    
    const headingChars = containerRef.current.querySelectorAll("h2 .split-char");
    const photos = photosRef.current.querySelectorAll(".collage-photo");
    const pillarPaths = svgPillarRef.current?.querySelectorAll("path");

    if (isActive) {
      const tl = anime.timeline();

      // Animate SVG Pillars drawing upwards
      if (pillarPaths) {
        tl.add({
          targets: pillarPaths,
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: "easeOutCubic",
          duration: 1500,
          delay: anime.stagger(200),
          opacity: [0, 1],
        }, 0);
      }

      // Photos entering with subtle rotation
      tl.add({
        targets: photos,
        scale: [0.8, 1],
        rotate: () => anime.random(-10, 10),
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: anime.stagger(150),
        easing: "easeOutBack",
      }, 300);

      // Text stagger
      tl.add({
        targets: headingChars,
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 800,
        delay: anime.stagger(20),
        easing: "easeOutExpo",
      }, 500);

      tl.add({
        targets: bodyRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutExpo",
      }, "-=400");

    } else {
      anime.set([headingChars, bodyRef.current, photos], {
        opacity: 0,
      });
      if (pillarPaths) anime.set(pillarPaths, { opacity: 0 });
      anime.set(photos, { scale: 0.8, translateY: 100, rotate: 0 });
    }
  }, [isActive]);

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen flex-1 relative flex flex-col md:flex-row items-center justify-center p-6 py-20 md:p-16 gap-12 md:gap-24 max-w-7xl mx-auto overflow-hidden"
    >
      {/* SVG Background Pillar */}
      <svg 
        ref={svgPillarRef} 
        className="absolute left-1/4 top-0 h-full w-32 opacity-20 text-zinc-700 pointer-events-none" 
        viewBox="0 0 100 1000" 
        preserveAspectRatio="none"
      >
        <path d="M20,0 L20,1000" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-0" />
        <path d="M50,0 L50,1000" stroke="currentColor" strokeWidth="8" fill="none" className="opacity-0 text-amber-900/30" />
        <path d="M80,0 L80,1000" stroke="currentColor" strokeWidth="1" fill="none" className="opacity-0" />
      </svg>

      <div 
        ref={photosRef}
        className="relative w-full max-w-[280px] md:max-w-md aspect-[4/5] z-10 flex-shrink-0"
      >
        {/* Photo 1 (Back left) */}
        <div className="collage-photo absolute top-0 left-0 w-2/3 h-2/3 origin-bottom-left z-10 opacity-0 hover:z-40!">
          <TiltPhoto
            src="/photos/dad1.jpg"
            alt="Dad 1"
            className="w-full h-full"
            innerClassName="w-full h-full rounded-xl overflow-hidden border border-zinc-800 shadow-2xl cursor-pointer transition-shadow duration-300 hover:shadow-amber-500/20"
            onClick={() => onPhotoClick("/photos/dad1.jpg")}
          />
        </div>
        {/* Photo 2 (Back right) */}
        <div className="collage-photo absolute bottom-0 right-0 w-2/3 h-2/3 origin-top-right z-20 opacity-0 hover:z-40!">
          <TiltPhoto
            src="/photos/dad2.jpg"
            alt="Dad 2"
            className="w-full h-full"
            innerClassName="w-full h-full rounded-xl overflow-hidden border border-zinc-800 shadow-2xl cursor-pointer transition-shadow duration-300 hover:shadow-amber-500/20"
            onClick={() => onPhotoClick("/photos/dad2.jpg")}
          />
        </div>
        {/* Photo 3 (Front center) */}
        <div className="collage-photo absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 origin-center z-30 opacity-0 hover:z-40!">
          <TiltPhoto
            src="/photos/dad3.jpg"
            alt="Dad 3"
            className="w-full h-full"
            innerClassName="w-full h-full rounded-2xl overflow-hidden border-2 border-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer transition-shadow duration-300 hover:shadow-amber-500/30"
            onClick={() => onPhotoClick("/photos/dad3.jpg")}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-xl z-20 relative">
        <h2 
          ref={headingRef}
          className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 text-zinc-100 leading-tight"
        >
          <SplitText>El pilar que no siempre se ve</SplitText>
        </h2>
        <p 
          ref={bodyRef}
          className="text-base md:text-2xl text-zinc-400 leading-relaxed font-light opacity-0 bg-zinc-950/50 p-4 rounded-xl backdrop-blur-sm border border-zinc-800/50"
        >
          Pa, quiero aprovechar hoy para agradecerte lo que a veces no te decimos lo suficiente: sin ti no seríamos nada. Gracias por ser el que siempre ve por nosotros, el que nos entiende y el que mantiene a esta familia a flote en todo momento.
        </p>
      </div>
    </div>
  );
}
