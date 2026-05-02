"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INACTIVE_COLOR = "#d6d3d1"; // stone-300
const ACTIVE_COLOR = "#1c1917"; // stone-900
const VH_PER_YACHT = 35;

const yachts = [
  { name: "Deos Yacht", size: 40, image: "/yacht1.jpg" },
  { name: "KB Knot Yacht", size: 35, image: "/yacht2.jpg" },
  { name: "Lefkon Yacht", size: 43, image: "/yacht3.jpg" },
  { name: "Calypso Yacht", size: 45, image: "/yacht4.jpg" },
  { name: "Valia Yacht", size: 43, image: "/yacht5.jpg" },
  { name: "Spirit Yacht", size: 43, image: "/yacht6.jpg" },
  { name: "Valkyra Yacht", size: 12, image: "/yacht7.jpg" },
];

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const nameRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const listWrapRef = useRef<HTMLDivElement>(null);

  const scrollToYacht = (i: number) => {
    if (!sectionRef.current) return;
    const sectionTop = sectionRef.current.offsetTop;
    const scrollable = sectionRef.current.offsetHeight - window.innerHeight;
    const progress = (i + 0.5) / yachts.length;
    window.scrollTo({ top: sectionTop + scrollable * progress, behavior: "smooth" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state
      nameRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { color: i === 0 ? ACTIVE_COLOR : INACTIVE_COLOR });
      });

      // Center first yacht on mount
      if (listRef.current && listWrapRef.current && nameRefs.current[0]) {
        const wrapH = listWrapRef.current.offsetHeight;
        const nameEl = nameRefs.current[0]!;
        gsap.set(listRef.current, {
          y: wrapH / 2 - nameEl.offsetTop - nameEl.offsetHeight / 2,
        });
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const rawProgress = self.progress * yachts.length;
          const idx = Math.min(yachts.length - 1, Math.floor(rawProgress));
          // fractional progress within current yacht's zone (0→1)
          const frac = rawProgress - idx;

          // --- Continuous list position interpolation ---
          if (listRef.current && listWrapRef.current) {
            const wrapH = listWrapRef.current.offsetHeight;
            const currName = nameRefs.current[idx];
            const nextName = nameRefs.current[Math.min(idx + 1, yachts.length - 1)];
            if (currName && nextName) {
              const currY = wrapH / 2 - currName.offsetTop - currName.offsetHeight / 2;
              const nextY = wrapH / 2 - nextName.offsetTop - nextName.offsetHeight / 2;
              // Smoothly interpolate between positions
              const targetY = currY + (nextY - currY) * frac;
              gsap.set(listRef.current, { y: targetY });
            }
          }

          // --- Image crossfade tied to scroll progress ---
          imageRefs.current.forEach((img, i) => {
            if (!img) return;
            let opacity = 0;
            if (i === idx) {
              // Current yacht: fade out as we approach next
              opacity = i === yachts.length - 1 ? 1 : 1 - Math.pow(frac, 2);
            } else if (i === idx + 1) {
              // Next yacht: fade in
              opacity = Math.pow(frac, 2);
            }
            gsap.set(img, { opacity });
          });

          // --- Name color transitions ---
          if (idx !== activeRef.current) {
            // Crossed into new yacht zone — animate color change
            const prevName = nameRefs.current[activeRef.current];
            const newName = nameRefs.current[idx];

            if (prevName) {
              gsap.to(prevName, {
                color: INACTIVE_COLOR,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
            if (newName) {
              gsap.to(newName, {
                color: ACTIVE_COLOR,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
              });
            }

            activeRef.current = idx;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-navbar-theme="dark"
      className="relative z-10"
      style={{ height: `${(yachts.length + 1) * VH_PER_YACHT}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center bg-[#f5f3f0]">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col items-center gap-10 px-8 lg:flex-row lg:gap-16 lg:px-16">
          {/* Yacht image — stacked layers for crossfade */}
          <div className="relative aspect-[4/3] w-full shrink-0 lg:w-[48%]">
            {yachts.map((yacht, i) => (
              <div
                key={yacht.name}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${yacht.image})`,
                  opacity: i === 0 ? 1 : 0,
                }}
              />
            ))}
          </div>

          {/* Yacht names — vertically centered, list slides */}
          <div ref={listWrapRef} className="relative h-screen overflow-hidden lg:w-[52%]">
            <div ref={listRef} className="absolute left-0 flex w-full flex-col gap-1">
              {yachts.map((yacht, i) => (
                <span
                  key={yacht.name}
                  ref={(el) => {
                    nameRefs.current[i] = el;
                  }}
                  onClick={() => scrollToYacht(i)}
                  className="font-serif cursor-pointer text-4xl font-semibold leading-[1.2] md:text-5xl lg:text-6xl xl:text-7xl"
                >
                  {yacht.name}
                  <sup className="font-sans ml-1 text-sm">{yacht.size}</sup>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
