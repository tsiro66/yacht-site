"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import MenuDrawer from "./MenuDrawer";

const THEME = {
  light: {
    logo: "#ffffff",
    link: "rgba(255,255,255,0.8)",
    btnText: "white",
  },
  dark: {
    logo: "#1c1917",
    link: "rgba(28,25,23,0.6)",
    btnText: "black",
  }
} as const;

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const themeRef = useRef<"light" | "dark">("light");
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.set(nav, { yPercent: -100 });

    let showAnim: gsap.core.Tween | null = null;

    const onPreloaderDone = () => {
      gsap.to(nav, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
        onComplete: () => {
          showAnim = gsap
            .from(nav, {
              yPercent: -100,
              paused: true,
              duration: 0.3,
              ease: "power2.out",
            })
            .progress(1);
        },
      });
    };
    window.addEventListener("preloader:done", onPreloaderDone);

    const applyTheme = (theme: "light" | "dark") => {
      if (theme === themeRef.current) return;
      themeRef.current = theme;
      setCurrentTheme(theme); // Update React state for the MenuDrawer prop

      const t = THEME[theme];
      gsap.to(nav.querySelectorAll(".nav-logo"), { color: t.logo, duration: 0.3 });
      gsap.to(nav.querySelectorAll(".nav-btn"), {
        color: t.btnText,
        duration: 0.3,
      });
    };

    const darkSections = document.querySelectorAll<HTMLElement>('[data-navbar-theme="dark"]');
    const themeTriggers: ScrollTrigger[] = [];

    darkSections.forEach((section) => {
      themeTriggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onEnter: () => applyTheme("dark"),
          onLeave: () => applyTheme("light"),
          onEnterBack: () => applyTheme("dark"),
          onLeaveBack: () => applyTheme("light"),
        }),
      );
    });

    // Allow other components (fixed elements, etc.) to set navbar theme via custom event
    const onThemeEvent = (e: Event) => {
      const theme = (e as CustomEvent<"light" | "dark">).detail;
      applyTheme(theme);
    };
    window.addEventListener("navbar:theme", onThemeEvent);

    return () => {
      window.removeEventListener("preloader:done", onPreloaderDone);
      window.removeEventListener("navbar:theme", onThemeEvent);
      showAnim?.kill();
      themeTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 z-[90] w-full bg-transparent backdrop-blur-md">
      <div className="mx-5 sm:mx-10 flex items-center justify-between px-6 py-5">
        
        {/* Pass currentTheme to the Drawer */}
        <MenuDrawer theme={currentTheme} />

        <Link
          href="/"
          className="nav-logo font-logo text-2xl font-semibold text-white"
        >
          99 knots
        </Link>

        <Link
          href="/book"
          className="nav-btn group relative hidden sm:block h-7 overflow-hidden px-6 text-lg font-medium tracking-wider text-white"
        >
          <span className="block h-7 leading-7 transition-transform duration-300 ease-out group-hover:-translate-y-full">
            Book
          </span>
          <span className="block h-7 leading-7 transition-transform duration-300 ease-out group-hover:-translate-y-full">
            Book
          </span>
        </Link>
      </div>
    </nav>
  );
}