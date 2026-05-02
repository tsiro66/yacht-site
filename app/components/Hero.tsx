"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Scroll-driven blur + text swap
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Blur bg image
      tl.to(
        bgRef.current,
        {
          filter: "blur(20px)",
          scale: 1.05,
          ease: "none",
        },
        0
      );

      // Scale down + fade out title (shrinks in) — quick
      tl.to(
        titleWrapRef.current,
        {
          scale: 0.95,
          opacity: 0,
          ease: "none",
          duration: 0.15,
        },
        0
      );

      // Fade in second title — starts right after, holds for rest of scroll
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          duration: 0.15,
        },
        0.15
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[500vh]">
      {/* Sticky container */}
      <div className="fixed top-0 left-0 z-0 h-screen w-full overflow-hidden">
        {/* Background image */}
        <div
          ref={bgRef}
          className="absolute -inset-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/hero.jpg)" }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Centered titles */}
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div ref={titleWrapRef} className="absolute flex flex-col items-center gap-6">
            <h1 className="font-serif max-w-4xl text-center text-5xl font-semibold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
              Adventure For The
              <br />
              Restless Soul
            </h1>
            <p className="max-w-lg text-center text-base font-light leading-relaxed text-white/80 md:text-lg">
              Set sail aboard a private luxury expedition yacht to the furthest
              reaches of Greece
            </p>
          </div>
          <h2
            ref={subtitleRef}
            className="font-serif absolute max-w-4xl text-center text-3xl font-semibold text-white opacity-0 md:text-5xl lg:text-6xl"
          >
            where luxury meets the untamed beauty of the open sea.
          </h2>
        </div>
      </div>
    </section>
  );
}
