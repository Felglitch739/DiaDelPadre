import { useEffect, useState, RefObject } from "react";

export function useInView(ref: RefObject<HTMLElement | null>, threshold = 0.3) {
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false); // To prevent animations from resetting when scrolling back up

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setHasEntered(true);
        } else {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  // We usually only want to trigger the entrance animation once, or re-trigger it.
  // For this presentation, we will return `inView` so it can trigger animations.
  // We can also return `hasEntered` if we want animations to only happen once.
  return { inView, hasEntered };
}
