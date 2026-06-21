import { useEffect, RefObject } from "react";

export function useTilt(ref: RefObject<HTMLElement | null>, maxTilt = 15) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Calculate mouse position relative to the center of the element
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate percentage (-1 to 1)
      const xPct = x / (rect.width / 2);
      const yPct = y / (rect.height / 2);

      // Clamp values
      const clampedX = Math.max(-1, Math.min(1, xPct));
      const clampedY = Math.max(-1, Math.min(1, yPct));

      // Calculate tilt degrees
      const tiltX = -clampedY * maxTilt;
      const tiltY = clampedX * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxTilt, ref]);
}
