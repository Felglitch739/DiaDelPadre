"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
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

  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 cursor-zoom-out animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 bg-white/10 hover:bg-amber-500/30 text-white border border-white/20 rounded-full p-3 shadow-2xl transition-all cursor-pointer z-50 flex items-center justify-center"
        aria-label="Cerrar imagen"
      >
        <X size={28} />
      </button>

      {/* Content wrapper */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-[75vh] md:h-[85vh] flex items-center justify-center rounded-xl overflow-hidden bg-transparent cursor-default animate-in zoom-in-95 duration-300"
      >
        <div className="relative w-full h-full p-2">
          <Image
            src={src}
            alt="Visor de foto"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain select-none drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Closing hint */}
      <p className="mt-8 text-zinc-400 text-sm md:text-base tracking-widest uppercase font-light animate-pulse">
        Toca el fondo para cerrar
      </p>
    </div>
  );
}
