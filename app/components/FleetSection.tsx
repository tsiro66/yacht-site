"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

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
    const progress = i / (yachts.length - 1);
    window.scrollTo({
      top: sectionTop + scrollable * progress,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      nameRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { color: i === 0 ? ACTIVE_COLOR : INACTIVE_COLOR });
      });

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
          const rawProgress = self.progress * (yachts.length - 1);
          const floorIdx = Math.floor(rawProgress);
          const frac = rawProgress - floorIdx;

          if (listRef.current && listWrapRef.current) {
            const wrapH = listWrapRef.current.offsetHeight;
            const currName = nameRefs.current[floorIdx];
            const nextName =
              nameRefs.current[Math.min(floorIdx + 1, yachts.length - 1)];

            if (currName && nextName) {
              const currY =
                wrapH / 2 - currName.offsetTop - currName.offsetHeight / 2;
              const nextY =
                wrapH / 2 - nextName.offsetTop - nextName.offsetHeight / 2;
              const targetY = currY + (nextY - currY) * frac;
              gsap.set(listRef.current, { y: targetY });
            }
          }

          imageRefs.current.forEach((img, i) => {
            if (!img) return;
            let opacity = 0;
            if (i === floorIdx) {
              opacity = 1 - frac;
            } else if (i === floorIdx + 1) {
              opacity = frac;
            }
            gsap.set(img, { opacity });
          });

          const highlightIdx = Math.round(rawProgress);

          if (highlightIdx !== activeRef.current) {
            const prevName = nameRefs.current[activeRef.current];
            const newName = nameRefs.current[highlightIdx];

            if (prevName) {
              gsap.to(prevName, {
                color: INACTIVE_COLOR,
                duration: 0.3,
                overwrite: "auto",
              });
            }
            if (newName) {
              gsap.to(newName, {
                color: ACTIVE_COLOR,
                duration: 0.3,
                overwrite: "auto",
              });
            }

            activeRef.current = highlightIdx;
          }
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* Mobile — static list */}
      <section
        data-navbar-theme="dark"
        className="relative z-10 bg-[#f5f3f0] px-6 py-16 lg:hidden"
      >
        <div className="mx-auto flex max-w-xl flex-col gap-8">
          {yachts.map((yacht) => (
            <div key={yacht.name} className="flex flex-col gap-3">
              <div
                className="aspect-[4/3] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${yacht.image})` }}
              />
              <span className="font-sans text-2xl font-semibold text-stone-900 md:text-3xl">
                {yacht.name}
                <sup className="font-sans ml-1 text-xs">{yacht.size}</sup>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop — scroll-driven animation */}
      <section
        ref={sectionRef}
        data-navbar-theme="dark"
        className="relative z-10 hidden lg:block"
        style={{ height: `${(yachts.length + 1) * VH_PER_YACHT}vh` }}
      >
        <div className="sticky top-0 flex h-screen w-full items-center bg-[#f5f3f0]">
          <div className="mx-auto flex w-full max-w-[90rem] flex-row items-center gap-16 px-16">
            <div className="relative aspect-[4/3] w-[48%] shrink-0">
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

            <div
              ref={listWrapRef}
              className="relative h-screen w-[52%] overflow-hidden"
            >
              <div
                ref={listRef}
                className="absolute left-0 flex w-full flex-col gap-1"
              >
                {yachts.map((yacht, i) => (
                  <span
                    key={yacht.name}
                    ref={(el) => {
                      nameRefs.current[i] = el;
                    }}
                    onClick={() => scrollToYacht(i)}
                    className="font-sans cursor-pointer text-6xl font-semibold leading-[1.2] xl:text-7xl"
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
    </>
  );
}
