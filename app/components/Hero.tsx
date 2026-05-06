"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import Lenis from "lenis";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // Changed to Video element
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- Entrance animations (after preloader) ---
    const entranceTl = gsap.timeline({ paused: true });

    gsap.set(titleRef.current, { opacity: 0, scale: 0.9 });
    gsap.set(descRef.current, { opacity: 0 });

    entranceTl
      .to(titleRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      })
      .to(
        descRef.current,
        { opacity: 1,  duration: 0.7, ease: "power3.out" },
        "-=0.4"
      );

    const onPreloaderDone = () => entranceTl.play();
    window.addEventListener("preloader:done", onPreloaderDone);

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

      // Blur the video instead of the div
      tl.to(
        videoRef.current,
        {
          filter: "blur(20px)",
          scale: 1.1, // Slightly higher scale to prevent edges showing during blur
          ease: "none",
        },
        0
      );

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

    }, sectionRef);

    return () => {
      window.removeEventListener("preloader:done", onPreloaderDone);
      entranceTl.kill();
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[150vh]">
      <div className="fixed top-0 left-0 z-0 h-screen w-full overflow-hidden">
        
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          // Using -inset-10 to allow for the scale/blur effect without white edges
          style={{ transform: 'scale(1.02)' }} 
        >
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Centered titles */}
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div ref={titleWrapRef} className="absolute flex flex-col items-center gap-2 sm:gap-6">
            <h1 ref={titleRef} className="font-sans max-w-4xl text-center text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
              Adventure For The
              <br />
              Restless Soul
            </h1>
            <p ref={descRef} className="max-w-70 md:max-w-lg text-center text-xs font-light leading-relaxed text-white/80 md:text-lg">
              Set sail aboard a private luxury expedition yacht to the furthest
              reaches of Greece
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}