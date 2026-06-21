"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import Image from "next/image";
import SplitText from "../SplitText";

interface SlideProps {
  isActive: boolean;
  onPhotoClick: (src: string) => void;
}

export default function Slide4({ isActive, onPhotoClick }: SlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !bodyRef.current) return;
    
    const headingChars = containerRef.current.querySelectorAll("h2 .split-char");
    // We will select words instead of chars for the paragraph
    const bodyWords = bodyRef.current.querySelectorAll(".word");

    if (isActive) {
      const tl = anime.timeline();

      // Accent Line
      tl.add({
        targets: accentRef.current,
        scaleY: [0, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: "easeInOutExpo",
      }, 0);

      // Photo reveal
      tl.add({
        targets: photoRef.current,
        opacity: [0, 1],
        translateX: [50, 0],
        scale: [0.9, 1],
        duration: 1500,
        easing: "easeOutCubic",
      }, 200);

      // Heading chars
      tl.add({
        targets: headingChars,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: anime.stagger(40),
        easing: "easeOutExpo",
      }, 400);

      // Body Words revealing like writing
      if (bodyWords.length > 0) {
        tl.add({
          targets: bodyWords,
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 400,
          delay: anime.stagger(50),
          easing: "easeOutQuad",
        }, 800);
      }

    } else {
      anime.set([headingChars, bodyWords, accentRef.current, photoRef.current], {
        opacity: 0,
      });
      anime.set(accentRef.current, { scaleY: 0 });
      anime.set(photoRef.current, { translateX: 50, scale: 0.9 });
    }
  }, [isActive]);

  const paragraphText = "Gracias a ti estoy donde estoy, soy quien soy y llegaré a ser alguien muy exitoso. A lo mejor ahorita no te lo puedo pagar o no te lo demuestro como debería, pero te prometo esto: todos tus esfuerzos, desvelos y enseñanzas van a valer la pena. Todo te lo debo a ti.";
  const words = paragraphText.split(" ");

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex flex-col md:flex-row items-center justify-center p-4 py-16 md:p-16 gap-8 md:gap-12 max-w-7xl mx-auto relative overflow-hidden"
    >
      <div className="flex-1 pl-6 md:pl-12 relative z-20">
        <div 
          ref={accentRef}
          className="absolute left-0 top-0 bottom-0 w-1 md:w-2 bg-gradient-to-b from-amber-600 via-amber-400 to-transparent origin-top opacity-0 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]"
        />
        
        <h2 
          ref={headingRef}
          className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 text-amber-500 tracking-tight"
        >
          <SplitText>La promesa</SplitText>
        </h2>
        <p 
          ref={bodyRef}
          className="text-lg md:text-3xl text-zinc-300 leading-relaxed font-light"
        >
          {words.map((word, i) => (
            <span key={i} className="word inline-block mr-2 opacity-0">
              {word}
            </span>
          ))}
        </p>
      </div>

      <div 
        ref={photoRef}
        className="w-1/2 max-w-[200px] md:w-full md:max-w-md aspect-[3/4] relative z-10 opacity-0 mt-8 md:mt-0"
      >
        <div 
          onClick={() => onPhotoClick("/photos/me&dadinmyhsgraduation.jpg")}
          className="w-full h-full rounded-2xl overflow-hidden border border-zinc-700 shadow-[0_0_40px_rgba(0,0,0,0.8)] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-amber-500/30 hover:border-amber-500/50 relative"
        >
          <Image 
            src="/photos/me&dadinmyhsgraduation.jpg" 
            alt="Graduation" 
            fill 
            className="object-cover" 
          />
          {/* Cinematic glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent mix-blend-overlay" />
        </div>
      </div>
    </div>
  );
}
