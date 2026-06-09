"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

export default function SmoothScroll() {
  const reqRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      reqRef.current = requestAnimationFrame(raf);
    }

    reqRef.current = requestAnimationFrame(raf);

    return () => {
      if (reqRef.current) {
        cancelAnimationFrame(reqRef.current);
      }
      lenis.destroy();
    };
  }, []);

  return null;
}
