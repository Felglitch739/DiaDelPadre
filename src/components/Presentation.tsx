"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import anime from "animejs";

import Slide1 from "./slides/Slide1";
import Slide2 from "./slides/Slide2";
import Slide3 from "./slides/Slide3";
import Slide4 from "./slides/Slide4";
import Slide5 from "./slides/Slide5";
import Lightbox from "./Lightbox";
import Loader from "./Loader";
import AudioPlayer from "./AudioPlayer";
import Particles from "./Particles";

const SLIDE_COUNT = 5;

export default function Presentation() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Use refs for gesture handlers to always have current values
  const activeSlideRef = useRef(activeSlide);
  const isAnimatingRef = useRef(isAnimating);
  const lightboxPhotoRef = useRef(lightboxPhoto);
  useEffect(() => {
    activeSlideRef.current = activeSlide;
    isAnimatingRef.current = isAnimating;
    lightboxPhotoRef.current = lightboxPhoto;
  }, [activeSlide, isAnimating, lightboxPhoto]);

  const goToSlide = useCallback((index: number) => {
    if (isAnimatingRef.current || index < 0 || index >= SLIDE_COUNT || index === activeSlideRef.current) return;

    isAnimatingRef.current = true;
    setIsAnimating(true);
    
    anime({
      targets: containerRef.current,
      translateY: `-${index * 100}vh`,
      duration: 1200,
      easing: "easeInOutExpo",
      complete: () => {
        activeSlideRef.current = index;
        setActiveSlide(index);
        isAnimatingRef.current = false;
        setIsAnimating(false);
      }
    });
  }, []);

  // ─── Wheel / Scroll (Desktop mouse wheel + trackpad) ───
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let wheelAccumulator = 0;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Block native scroll

      if (!isLoaded || isAnimatingRef.current || lightboxPhotoRef.current) return;

      wheelAccumulator += e.deltaY;

      // Reset accumulator after 300ms of inactivity (new gesture)
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelAccumulator = 0; }, 300);

      const threshold = 30; // pixels - low enough for a single mouse wheel tick

      if (wheelAccumulator > threshold) {
        goToSlide(activeSlideRef.current + 1);
        wheelAccumulator = 0;
      } else if (wheelAccumulator < -threshold) {
        goToSlide(activeSlideRef.current - 1);
        wheelAccumulator = 0;
      }
    };

    root.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", handleWheel);
      if (wheelTimer) clearTimeout(wheelTimer);
    };
  }, [goToSlide]);

  // ─── Touch Swipe (Mobile) ───
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (lightboxPhotoRef.current) return;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent native scroll so the page doesn't bounce
      if (!lightboxPhotoRef.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current || lightboxPhotoRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY; // positive = swiped up
      const deltaTime = Date.now() - touchStartTime;

      // Velocity-based detection: even short flicks work
      const velocity = Math.abs(deltaY) / deltaTime; // px/ms

      const minDistance = 30; // minimum px distance
      const minVelocity = 0.1; // minimum px/ms velocity

      if (Math.abs(deltaY) > minDistance || velocity > minVelocity) {
        if (deltaY > 0) {
          goToSlide(activeSlideRef.current + 1); // Swipe up → next
        } else {
          goToSlide(activeSlideRef.current - 1); // Swipe down → prev
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goToSlide]);

  // ─── Mouse Drag (Desktop click-drag) ───
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let isDragging = false;
    let dragStartY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (lightboxPhotoRef.current) return;
      isDragging = true;
      dragStartY = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging || isAnimatingRef.current || lightboxPhotoRef.current) {
        isDragging = false;
        return;
      }

      isDragging = false;
      const deltaY = dragStartY - e.clientY;
      const threshold = 60;

      if (deltaY > threshold) {
        goToSlide(activeSlideRef.current + 1);
      } else if (deltaY < -threshold) {
        goToSlide(activeSlideRef.current - 1);
      }
    };

    root.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      root.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [goToSlide]);

  // ─── Mouse Parallax (Desktop only) ───
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

      anime({
        targets: wrapperRef.current,
        translateX: xPos,
        translateY: yPos,
        duration: 1000,
        easing: "easeOutExpo"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ─── Keyboard Navigation ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") goToSlide(activeSlideRef.current + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") goToSlide(activeSlideRef.current - 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToSlide]);

  return (
    <>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      <AudioPlayer />
      
      <div ref={rootRef} className="w-full h-full overflow-hidden bg-zinc-950 relative perspective-[1000px]">
        {/* Global Particle System */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Particles isActive={isLoaded} count={30} color="bg-amber-500/40" />
        </div>
        
        {/* Wrapper for parallax */}
      <div ref={wrapperRef} className="w-full h-full will-change-transform scale-105">
        
        {/* Slide Container - Moves vertically */}
        <div 
          ref={containerRef} 
          className="w-full h-[500vh] flex flex-col will-change-transform"
        >
          <div className="w-full h-[100vh]">
            <Slide1 isActive={activeSlide === 0} />
          </div>
          <div className="w-full h-[100vh]">
            <Slide2 isActive={activeSlide === 1} onPhotoClick={setLightboxPhoto} />
          </div>
          <div className="w-full h-[100vh]">
            <Slide3 isActive={activeSlide === 2} onPhotoClick={setLightboxPhoto} />
          </div>
          <div className="w-full h-[100vh]">
            <Slide4 isActive={activeSlide === 3} onPhotoClick={setLightboxPhoto} />
          </div>
          <div className="w-full h-[100vh]">
            <Slide5 isActive={activeSlide === 4} onPhotoClick={setLightboxPhoto} />
          </div>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              activeSlide === i ? "bg-amber-500 scale-150" : "bg-zinc-700 hover:bg-zinc-500"
            }`}
            aria-label={`Ir a diapositiva ${i + 1}`}
          />
        ))}
      </div>

      {/* Global Image Lightbox */}
      <Lightbox src={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </div>
    </>
  );
}
