"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Fleet", href: "/fleet" },
  { label: "Cruises", href: "/cruises" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const THEME = {
  light: {
    logo: "#ffffff",
    link: "rgba(255,255,255,0.8)",
    btnText: "rgba(255,255,255,0.9)",
  },
  dark: {
    logo: "#1c1917",
    link: "rgba(28,25,23,0.6)",
    btnText: "rgba(0,0,0,0.9)",
  },
} as const;

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const themeRef = useRef<"light" | "dark">("light");

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Hide navbar until preloader done
    gsap.set(nav, { yPercent: -100 });

    let showAnim: gsap.core.Tween | null = null;
    let directionTrigger: ScrollTrigger | null = null;

    const onPreloaderDone = () => {
      // Slide navbar in
      gsap.to(nav, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
        onComplete: () => {
          // Only setup scroll-direction hide AFTER entrance done
          showAnim = gsap
            .from(nav, {
              yPercent: -100,
              paused: true,
              duration: 0.3,
              ease: "power2.out",
            })
            .progress(1);

          directionTrigger = ScrollTrigger.create({
            start: "top top",
            end: "max",
            onUpdate: (self) => {
              if (self.direction === -1) {
                showAnim!.play();
              } else {
                showAnim!.reverse();
              }
            },
          });
        },
      });
    };
    window.addEventListener("preloader:done", onPreloaderDone);

    // Theme switching for dark-bg sections
    const applyTheme = (theme: "light" | "dark") => {
      if (theme === themeRef.current) return;
      themeRef.current = theme;
      const t = THEME[theme];
      gsap.to(nav.querySelectorAll(".nav-logo"), { color: t.logo, duration: 0.3 });
      gsap.to(nav.querySelectorAll(".nav-link"), { color: t.link, duration: 0.3 });
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

    return () => {
      window.removeEventListener("preloader:done", onPreloaderDone);
      directionTrigger?.kill();
      showAnim?.kill();
      themeTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 z-50 w-full">
      <div className="mx-10 flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link
          href="/"
          className="nav-logo font-logo text-2xl font-semibold text-white"
        >
          99 knots
        </Link>

        {/* Links */}
        <ul className="hidden items-center gap-20 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="nav-link group relative block h-6 overflow-hidden font-medium uppercase text-white/80"
              >
                <span className="block text-lg transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  {link.label}
                </span>
                <span className="block text-lg transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Book button */}
        <Link
          href="/book"
          className="nav-btn group relative block h-7 overflow-hidden px-6 text-lg font-semibold uppercase tracking-wider text-white"
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
