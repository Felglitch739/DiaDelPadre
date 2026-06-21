import React, { useState, useRef, useEffect } from "react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Set dynamic source depending on environment
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    audio.src = `${basePath}/musica.mp3`;

    audio.volume = 0.5; // Soft volume by default
    
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50">
      <audio ref={audioRef} loop />
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-500/50 transition-all duration-300 shadow-lg"
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0.5">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>
    </div>
  );
}
