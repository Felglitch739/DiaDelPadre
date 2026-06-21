"use client";

import React, { useEffect, useRef, useCallback } from "react";
import anime from "animejs";
import Image from "next/image";
import { X } from "lucide-react";

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    anime({
      targets: overlayRef.current,
      opacity: 0,
      duration: 400,
      easing: "easeOutSine",
      complete: () => {
        if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
        onClose();
      }
    });
    anime({
      targets: contentRef.current,
      opacity: 0,
      scale: 0.95,
      duration: 400,
      easing: "easeOutSine",
    });
    anime({
      targets: closeButtonRef.current,
      opacity: 0,
      scale: 0.5,
      duration: 250,
      easing: "easeOutQuad",
    });
  }, [onClose]);

  // Entrance animations on mount
  useEffect(() => {
    if (!src) return;

    anime({
      targets: overlayRef.current,
      opacity: [0, 1],
      duration: 400,
      easing: "easeOutSine",
      begin: () => {
        if (overlayRef.current) overlayRef.current.style.pointerEvents = "auto";
      }
    });
    anime({
      targets: contentRef.current,
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 500,
      easing: "easeOutBack",
    });
    anime({
      targets: closeButtonRef.current,
      scale: [0.5, 1],
      opacity: [0, 1],
      duration: 400,
      easing: "easeOutBack",
      delay: 150
    });

    // Escape key listener to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [src, handleClose]);

  // Prevent drag and scroll propagation inside the lightbox
  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (!src) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl opacity-0 pointer-events-none cursor-zoom-out p-4 md:p-8"
      onClick={handleClose}
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-6 right-6 bg-white/10 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/40 text-zinc-300 border border-white/10 rounded-full p-3 shadow-2xl transition-all duration-300 backdrop-blur-md cursor-pointer z-50 active:scale-95 flex items-center justify-center outline-none"
        aria-label="Cerrar imagen"
      >
        <X size={24} />
      </button>

      {/* Content wrapper */}
      <div
        ref={contentRef}
        onClick={stopPropagation}
        className="relative w-full max-w-4xl h-[70vh] md:h-[80vh] flex items-center justify-center rounded-2xl overflow-hidden border border-zinc-800/80 shadow-[0_0_50px_rgba(245,158,11,0.15)] bg-zinc-900 cursor-default"
      >
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
      </div>

      {/* Closing hint */}
      <p className="mt-6 text-zinc-500 text-sm md:text-base animate-pulse tracking-wide font-light">
        Toca fuera de la imagen para cerrar
      </p>
    </div>
  );
}
