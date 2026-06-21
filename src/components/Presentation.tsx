"use client";

import React, { useState, useRef, useEffect } from "react";
import Slide1 from "./slides/Slide1";
import Slide2 from "./slides/Slide2";
import Slide3 from "./slides/Slide3";
import Slide4 from "./slides/Slide4";
import Slide5 from "./slides/Slide5";
import Lightbox from "./Lightbox";
import Loader from "./Loader";
import AudioPlayer from "./AudioPlayer";
import Particles from "./Particles";
import { useInView } from "../hooks/useInView";

const SLIDE_COUNT = 5;

// Helper component to wrap each slide with IntersectionObserver
function SlideSection({ children, index, onVisible }: { children: (isActive: boolean) => React.ReactNode, index: number, onVisible: (idx: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { inView, hasEntered } = useInView(ref, 0.4);

  // Notify parent which slide is currently most visible for the sidebar indicators
  useEffect(() => {
    if (inView) {
      onVisible(index);
    }
  }, [inView, index, onVisible]);

  return (
    <div ref={ref} id={`slide-${index}`} className="w-full min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* We pass hasEntered so that once a slide is scrolled into view, it animates and STAYS visible forever */}
      {/* We also add a subtle gradient to blend the sections seamlessly */}
      {children(hasEntered)}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-zinc-950 to-transparent z-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent z-50 pointer-events-none" />
    </div>
  );
}

export default function Presentation() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [activeIndicator, setActiveIndicator] = useState(0);

  const scrollToSlide = (index: number) => {
    const el = document.getElementById(`slide-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      <AudioPlayer />
      
      <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-zinc-950 relative scroll-smooth">
        {/* Global Particle System */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <Particles isActive={isLoaded} count={30} color="bg-amber-500/40" />
        </div>
        
        {/* Slide 1 */}
        <SlideSection index={0} onVisible={setActiveIndicator}>
          {(isActive) => <Slide1 isActive={isActive} />}
        </SlideSection>

        {/* Slide 2 */}
        <SlideSection index={1} onVisible={setActiveIndicator}>
          {(isActive) => <Slide2 isActive={isActive} onPhotoClick={setLightboxPhoto} />}
        </SlideSection>

        {/* Slide 3 */}
        <SlideSection index={2} onVisible={setActiveIndicator}>
          {(isActive) => <Slide3 isActive={isActive} onPhotoClick={setLightboxPhoto} />}
        </SlideSection>

        {/* Slide 4 */}
        <SlideSection index={3} onVisible={setActiveIndicator}>
          {(isActive) => <Slide4 isActive={isActive} onPhotoClick={setLightboxPhoto} />}
        </SlideSection>

        {/* Slide 5 */}
        <SlideSection index={4} onVisible={setActiveIndicator}>
          {(isActive) => <Slide5 isActive={isActive} onPhotoClick={setLightboxPhoto} />}
        </SlideSection>
      </div>
      
      {/* Slide Indicators */}
      <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              activeIndicator === i ? "bg-amber-500 scale-150" : "bg-zinc-700 hover:bg-zinc-500"
            }`}
            aria-label={`Ir a diapositiva ${i + 1}`}
          />
        ))}
      </div>

      {/* Global Image Lightbox */}
      <Lightbox src={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </>
  );
}
