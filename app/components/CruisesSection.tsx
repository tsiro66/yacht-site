"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAVY = "#0b1f3f";

const cruiseImages = [
  { src: "/cruise1.jpg", style: { top: "8%", left: "-4%", width: "30vw", height: "42vh" }, rotate: -6, pileX: 32, pileY: 85 },
  { src: "/cruise2.jpg", style: { top: "4%", right: "-2%", width: "32vw", height: "46vh" }, rotate: 5, pileX: -34, pileY: 90 },
  { src: "/cruise3.jpg", style: { bottom: "-5%", left: "37%", width: "26vw", height: "36vh" }, rotate: -3, pileX: 3, pileY: 57 },
  { src: "/cruise4.jpg", style: { bottom: "10%", left: "3%", width: "28vw", height: "40vh" }, rotate: 12, pileX: 26, pileY: 40 },
  { src: "/cruise5.jpg", style: { bottom: "5%", right: "4%", width: "29vw", height: "41vh" }, rotate: -8, pileX: -30, pileY: 38 },
];

export default function CruisesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const vw = window.innerWidth / 100;
      const vh = window.innerHeight / 100;

      // 1. Split Panels (0% to 20% of scroll)
      gsap.to(topPanelRef.current, {
        yPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });
      gsap.to(bottomPanelRef.current, {
        yPercent: 100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });

      // 2. Scatter Images (20% to 70% of scroll)
      imageRefs.current.forEach((el, i) => {
        if (!el) return;
        const cfg = cruiseImages[i];
        gsap.fromTo(el,
          { x: cfg.pileX * vw, y: cfg.pileY * vh, rotate: 0, scale: 0.9 },
          {
            x: 0,
            y: 0,
            rotate: cfg.rotate,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "20% top",
              end: "70% top",
              scrub: true,
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="cruises"
      ref={sectionRef}
      className="relative h-[450vh] w-full" // Extra height keeps it sticky longer
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ backgroundColor: NAVY }}>
        <div className="absolute inset-0 hidden lg:block">
          {cruiseImages.map((img, i) => (
            <div
              key={img.src}
              ref={(el) => { imageRefs.current[i] = el; }}
              className="absolute overflow-hidden rounded-2xl shadow-2xl"
              style={{
                ...img.style,
                backgroundImage: `url(${img.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </div>

        <div className="pointer-events-none relative z-10 flex h-full items-center justify-center text-stone-50">
          <div className="flex flex-col items-center gap-4 px-8 text-center">
            <h2 className="font-sans text-6xl font-semibold lg:text-7xl xl:text-8xl">Our Cruises</h2>
            <p className="max-w-xl font-sans text-base text-stone-300 lg:text-lg">
              Curated journeys across the Aegean and Ionian seas.
            </p>
          </div>
        </div>

        <div ref={topPanelRef} className="absolute inset-x-0 top-0 z-20 hidden h-1/2 bg-[#f5f3f0] lg:block" />
        <div ref={bottomPanelRef} className="absolute inset-x-0 bottom-0 z-20 hidden h-1/2 bg-[#f5f3f0] lg:block" />
      </div>
    </section>
  );
}