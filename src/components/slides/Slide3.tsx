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

export default function Slide3({ isActive, onPhotoClick }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const polaroidsRef = useRef<HTMLDivElement>(null);
  const svgRingsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !polaroidsRef.current) return;

    const headingChars = containerRef.current.querySelectorAll("h2 .split-char");
    const polaroids = polaroidsRef.current.querySelectorAll(".polaroid");
    const rings = svgRingsRef.current?.querySelectorAll("circle");

    if (isActive) {
      const tl = anime.timeline();

      // Animate rings
      if (rings) {
        tl.add({
          targets: rings,
          strokeDashoffset: [anime.setDashoffset, 0],
          opacity: [0, 0.15],
          scale: [0.5, 1],
          duration: 2000,
          delay: anime.stagger(150),
          easing: "easeOutSine",
        }, 0);
      }

      // Staggered text
      tl.add({
        targets: headingChars,
        opacity: [0, 1],
        translateY: [20, 0],
        rotateX: [90, 0],
        duration: 800,
        delay: anime.stagger(30),
        easing: "easeOutBack",
      }, 300);

      tl.add({
        targets: bodyRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutExpo",
      }, "-=400");

      // Falling polaroids
      tl.add({
        targets: polaroids,
        translateY: ["-100vh", "0"],
        rotate: () => anime.random(-15, 15),
        opacity: [0, 1],
        duration: 1500,
        delay: anime.stagger(250),
        easing: "easeOutElastic(1, .8)",
      }, 500);

    } else {
      anime.set([headingChars, bodyRef.current, polaroids], {
        opacity: 0,
      });
      if (rings) anime.set(rings, { opacity: 0, scale: 0.5 });
      anime.set(polaroids, { translateY: "-100vh", rotate: 0 });
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative flex flex-col-reverse md:flex-row items-center justify-center p-6 py-20 md:p-16 gap-12 md:gap-24 max-w-7xl mx-auto overflow-hidden"
    >
      {/* SVG Steel Rings Background */}
      <svg
        ref={svgRingsRef}
        className="absolute inset-0 w-full h-full text-zinc-500 pointer-events-none"
        viewBox="0 0 1000 1000"
      >
        <circle cx="500" cy="500" r="200" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-0" />
        <circle cx="500" cy="500" r="300" stroke="currentColor" strokeWidth="1" fill="none" className="opacity-0" />
        <circle cx="500" cy="500" r="450" stroke="currentColor" strokeWidth="0.5" fill="none" className="opacity-0" />
        <circle cx="500" cy="500" r="600" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="10 20" className="opacity-0 text-amber-900/40" />
      </svg>

      <div className="flex-1 flex flex-col justify-center max-w-xl z-20 relative">
        <h2
          ref={headingRef}
          className="text-3xl md:text-6xl font-black mb-4 md:mb-6 text-zinc-100 leading-tight uppercase tracking-tighter"
        >
          <SplitText>Paciencia de acero</SplitText>
        </h2>
        <p
          ref={bodyRef}
          className="text-base md:text-xl text-zinc-300 leading-relaxed font-light opacity-0 bg-zinc-900/60 p-4 md:p-6 border-l-4 border-amber-500 rounded-r-xl backdrop-blur-md"
        >
          Sé el peso que cargas y todo lo que haces por mantenernos bien, aparte de la paciencia infinita que tienes (sobre todo para aguantar a má cuando el Hashimoto la pone irritable jsjsj). Eres nuestro centro de equilibrio y el héroe detrás de cámaras de esta casa.
        </p>
      </div>

      <div
        ref={polaroidsRef}
        className="relative w-full max-w-[300px] md:max-w-sm aspect-square z-10 flex-shrink-0 mb-8 md:mb-0"
      >
        {/* Polaroid 1 */}
        <div className="polaroid absolute top-0 right-10 w-32 md:w-48 aspect-[3/4] opacity-0 origin-bottom hover:z-40!">
          <TiltPhoto
            src="/photos/dad&mebaby2.jpg"
            alt="Baby 1"
            className="w-full h-full bg-white p-3 pb-12 shadow-2xl rounded-sm cursor-pointer transition-shadow duration-300 hover:shadow-amber-500/20"
            innerClassName="bg-zinc-200 overflow-hidden"
            onClick={() => onPhotoClick("/photos/dad&mebaby2.jpg")}
          />
        </div>
        {/* Polaroid 2 */}
        <div className="polaroid absolute bottom-0 left-0 w-40 md:w-56 aspect-[3/4] opacity-0 origin-bottom hover:z-40!">
          <TiltPhoto
            src="/photos/dad&mebaby3.jpg"
            alt="Baby 2"
            className="w-full h-full bg-white p-3 pb-14 shadow-2xl rounded-sm cursor-pointer transition-shadow duration-300 hover:shadow-amber-500/20"
            innerClassName="bg-zinc-200 overflow-hidden"
            onClick={() => onPhotoClick("/photos/dad&mebaby3.jpg")}
          />
        </div>
        {/* Polaroid 3 */}
        <div className="polaroid absolute top-1/4 left-10 md:left-20 w-36 md:w-52 aspect-[3/4] opacity-0 origin-bottom hover:z-40!">
          <TiltPhoto
            src="/photos/dad&mebaby4.jpg"
            alt="Baby 3"
            className="w-full h-full bg-white p-3 pb-12 shadow-2xl rounded-sm cursor-pointer transition-shadow duration-300 hover:shadow-amber-500/20"
            innerClassName="bg-zinc-200 overflow-hidden"
            onClick={() => onPhotoClick("/photos/dad&mebaby4.jpg")}
          />
        </div>
      </div>
    </div>
  );
}
