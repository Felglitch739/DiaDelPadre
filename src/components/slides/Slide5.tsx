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

const ALL_PHOTOS = [
  "/photos/dad&me&sister.jpg",
  "/photos/dad&me.jpg",
  "/photos/dad&me2.jpg",
  "/photos/dad&mebaby2.jpg",
  "/photos/dad&mebaby3.jpg",
  "/photos/dad&mebaby4.jpg",
  "/photos/dad1.jpg",
  "/photos/dad2.jpg",
  "/photos/dad3.jpg",
  "/photos/dad4.jpg",
  "/photos/dad5.jpg",
  "/photos/me&dadinmyhsgraduation.jpg",
  "/photos/youngerDad.jpg",
];

export default function Slide5({ isActive, onPhotoClick }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !galleryRef.current) return;
    
    const headingChars = containerRef.current.querySelectorAll("h2 .split-char");
    const photos = galleryRef.current.querySelectorAll(".outro-photo");
    const innerPhotos = galleryRef.current.querySelectorAll(".outro-photo-inner");

    if (isActive) {
      const tl = anime.timeline();

      // ─── Grid-based distribution to spread photos evenly ───
      // We create a grid of cells and place each photo in a unique cell
      const cols = 4;
      const rows = 4;
      const totalCells = cols * rows;
      
      // Create shuffled cell indices so photos go to different spots
      const cellIndices: number[] = [];
      for (let i = 0; i < totalCells; i++) cellIndices.push(i);
      // Fisher-Yates shuffle
      for (let i = cellIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cellIndices[i], cellIndices[j]] = [cellIndices[j], cellIndices[i]];
      }

      // Position each photo in its assigned grid cell with a small random offset
      photos.forEach((photo, idx) => {
        const cellIdx = cellIndices[idx % totalCells];
        const col = cellIdx % cols;
        const row = Math.floor(cellIdx / cols);

        // Calculate percentage position within the viewport, adding safe padding
        const cellW = 100 / cols;
        const cellH = 100 / rows;

        const paddingX = window.innerWidth < 768 ? 20 : 10;
        const paddingY = window.innerWidth < 768 ? 20 : 10;
        const safeW = 100 - paddingX * 2;
        const safeH = 100 - paddingY * 2;

        const rawX = cellW * col + cellW * 0.5 + (Math.random() - 0.5) * cellW * 0.5;
        const rawY = cellH * row + cellH * 0.5 + (Math.random() - 0.5) * cellH * 0.5;

        const xPercent = paddingX + rawX * (safeW / 100);
        const yPercent = paddingY + rawY * (safeH / 100);

        // Convert to viewport-relative transform from center
        // Photos start at center (50%, 50%), so offset = position - 50%
        const xOffset = xPercent - 50;
        const yOffset = yPercent - 50;

        anime.set(photo, {
          opacity: 1,
          translateX: xOffset + 'vw',
          translateY: yOffset + 'vh',
        });
      });

      // Ensure inner photos start invisible and small
      anime.set(innerPhotos, {
        opacity: 0,
        scale: 0.3,
        rotate: () => anime.random(-20, 20) + 'deg',
      });

      // Photos bursting in sequentially
      tl.add({
        targets: innerPhotos,
        scale: [0.3, 1],
        opacity: [0, 0.7],
        rotate: () => anime.random(-8, 8) + 'deg',
        duration: 2000,
        delay: anime.stagger(100),
        easing: "easeOutElastic(1, .8)",
      }, 200);

      // Photos continuous slow floating after appearing
      tl.add({
        targets: photos,
        translateY: "+=8vh",
        duration: 15000,
        easing: "linear",
      }, 0);

      // Main Text appears much earlier while photos are still appearing
      tl.add({
        targets: headingChars,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1200,
        delay: anime.stagger(50),
        easing: "easeOutExpo",
      }, 1000);

      tl.add({
        targets: subtitleRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: "easeOutExpo",
      }, "-=800");

    } else {
      anime.set([headingChars, subtitleRef.current, photos, innerPhotos], {
        opacity: 0,
      });
      anime.remove([photos, innerPhotos]);
    }
  }, [isActive]);

  return (
    <div className="w-full min-h-screen flex-1 relative flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-zinc-950">
      
      {/* Background Montage Gallery */}
      <div 
        ref={galleryRef} 
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-lighten will-change-transform"
      >
        {ALL_PHOTOS.map((src, idx) => (
          <div 
            key={idx}
            className="outro-photo absolute w-24 md:w-56 aspect-[4/5] md:aspect-video pointer-events-auto hover:z-40! will-change-transform"
          >
            <TiltPhoto
              src={src}
              alt={`Memory ${idx}`}
              className="w-full h-full"
              innerClassName="outro-photo-inner w-full h-full relative rounded-xl overflow-hidden border border-zinc-800/80 shadow-2xl cursor-pointer transition-shadow duration-500 hover:border-amber-500/50 hover:shadow-amber-500/20"
              sizes="(max-width: 768px) 192px, 320px"
              onClick={() => onPhotoClick(src)}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950/90 z-20 pointer-events-none" />

      <div ref={containerRef} className="z-30 relative px-4 w-full max-w-[100vw] pointer-events-none">
        <h2 
          ref={headingRef}
          className="text-3xl sm:text-4xl md:text-8xl font-black mb-4 md:mb-6 text-zinc-100"
        >
          <SplitText>Gracias por todo.</SplitText>
        </h2>
        <p 
          ref={subtitleRef}
          className="text-2xl md:text-5xl text-amber-500 font-bold opacity-0 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]"
        >
          Te quiero mucho, pa.
        </p>
      </div>
    </div>
  );
}
