"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

export default function ContactForm() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cruises = document.getElementById("cruises");
    if (!cruises || !panelRef.current) return;

    // Set initial position off-screen to the right
    gsap.set(panelRef.current, { xPercent: 100 });

    const ctx = gsap.context(() => {
      // 1. Slide the panel in (70% to 100% of Cruises scroll)
      gsap.to(panelRef.current, {
        xPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: cruises,
          start: "50% top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // 2. Switch navbar to dark when panel is mostly visible
      ScrollTrigger.create({
        trigger: cruises,
        start: "85% top",
        end: "bottom bottom",
        onEnter: () => window.dispatchEvent(new CustomEvent("navbar:theme", { detail: "dark" })),
        onLeaveBack: () => window.dispatchEvent(new CustomEvent("navbar:theme", { detail: "light" })),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[50] flex items-center justify-center bg-[#f5f3f0] will-change-transform pointer-events-none"
    >
      <div className="w-full max-w-lg px-8 py-16 pointer-events-auto">
        <div>
          <h2 className="font-sans text-5xl sm:text-6xl font-semibold text-stone-900 tracking-tight">
            Get in Touch
          </h2>
          <p className="mt-4 text-stone-500 text-base">
            Lorem ipsum dolor sit amet.
          </p>
        </div>

        <form className="mt-12 flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Field label="Name" name="name" type="text" placeholder="Your full name" />
          </div>
          <div>
            <Field label="Email" name="email" type="email" placeholder="your@email.com" />
          </div>
          <div className="pt-4">
            <button className="group/btn relative w-full overflow-hidden border border-stone-900 py-4 text-stone-900 transition-colors duration-500">
              <span className="relative z-10 group-hover/btn:text-[#f5f3f0]">Send Inquiry</span>
              <span className="absolute inset-0 origin-left scale-x-0 bg-stone-900 transition-transform duration-500 group-hover/btn:scale-x-100" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}

function Field({ label, name, type, placeholder }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-stone-400 text-xs font-medium uppercase tracking-widest">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-stone-300 text-stone-900 py-3 outline-none focus:border-stone-600 transition-colors"
      />
    </div>
  );
}