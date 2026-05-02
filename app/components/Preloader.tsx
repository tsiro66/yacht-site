"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    // Lock scroll while preloader active
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        container.style.display = "none";
        window.dispatchEvent(new CustomEvent("preloader:done"));
      },
    });

    tl.fromTo(
      text,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
      .to(text, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        delay: 0.4,
      })
      .to(container, {
        yPercent: -100,
        duration: 0.8,
        ease: "power3.inOut",
      });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "#0a1128" }}
    >
      <span
        ref={textRef}
        className="font-logo text-white text-5xl md:text-7xl lg:text-8xl opacity-0 tracking-wide"
      >
        99 knots
      </span>
    </div>
  );
}
