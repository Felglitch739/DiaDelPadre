"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mount and entrance animation
  useEffect(() => {
    if (src) {
      setIsMounted(true);
      // Small delay to allow React to mount the DOM node before adding the opacity class
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Wait for exit transition to finish before unmounting
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [src]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && src) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [src, onClose]);

  if (!isMounted && !src) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 cursor-zoom-out transition-all duration-300 ease-out ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={`absolute top-4 right-4 md:top-6 md:right-6 bg-white/10 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/40 text-zinc-300 border border-white/10 rounded-full p-3 shadow-2xl transition-all duration-300 backdrop-blur-md cursor-pointer z-50 flex items-center justify-center outline-none ${
          isVisible ? "scale-100 opacity-100 delay-150" : "scale-50 opacity-0"
        }`}
        aria-label="Cerrar imagen"
      >
        <X size={24} />
      </button>

      {/* Content wrapper */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl h-[70vh] md:h-[80vh] flex items-center justify-center rounded-2xl overflow-hidden border border-zinc-800/80 shadow-[0_0_50px_rgba(245,158,11,0.15)] bg-zinc-900 cursor-default transition-all duration-500 ease-out ${
          isVisible ? "scale-100 opacity-100 translate-y-0 delay-75" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {src && (
          <div className="relative w-full h-full p-2">
            <Image
              src={src}
              alt="Visor de foto"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain select-none"
              priority
            />
          </div>
        )}
      </div>

      {/* Closing hint */}
      <p className={`mt-6 text-zinc-500 text-sm md:text-base tracking-wide font-light transition-opacity duration-700 ${
        isVisible ? "opacity-100 animate-pulse delay-300" : "opacity-0"
      }`}>
        Toca fuera de la imagen para cerrar
      </p>
    </div>
  );
}
