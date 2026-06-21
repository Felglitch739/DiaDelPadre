import React, { useRef } from "react";
import Image from "next/image";
import { useTilt } from "../hooks/useTilt";

interface TiltPhotoProps {
  src: string;
  alt: string;
  className?: string;
  innerClassName?: string;
  onClick?: () => void;
  sizes?: string;
}

export default function TiltPhoto({ src, alt, className = "", innerClassName = "", onClick, sizes = "100vw" }: TiltPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref, 10);

  return (
    <div ref={ref} className={`${className} will-change-transform`} onClick={onClick}>
      <div className={`w-full h-full relative ${innerClassName}`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
      </div>
    </div>
  );
}
