"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ScrollTrigger } from "@/app/lib/gsap";

const navLinks = [
  { label: "Fleet", href: "/fleet" },
  { label: "Cruises", href: "/cruises" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Accessibility", href: "#" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top 50%",
      onEnter: () => window.dispatchEvent(new CustomEvent("navbar:theme", { detail: "light" })),
      onLeaveBack: () => window.dispatchEvent(new CustomEvent("navbar:theme", { detail: "dark" })),
    });

    return () => trigger.kill();
  }, []);

  return (
    <footer ref={footerRef} className="relative z-[60] min-h-screen bg-[#0a1628]">
      <div className="flex min-h-screen flex-col justify-between px-6 md:px-10 lg:px-16 py-20 md:py-32">
        <div className="mb-16 md:mb-24">
          <Link
            href="/"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-white/90 hover:text-white transition-colors duration-500"
          >
            99 knots
          </Link>
          <p className="mt-6 max-w-md text-white/40 text-base md:text-lg">
            Adventure for the restless soul.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-white/30 text-xs font-medium uppercase tracking-widest mb-2">
              Navigate
            </span>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-white/30 text-xs font-medium uppercase tracking-widest mb-2">
              Follow
            </span>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="col-span-2 flex flex-col gap-3">
            <span className="text-white/30 text-xs font-medium uppercase tracking-widest mb-2">
              Book a Voyage
            </span>
            <Link
              href="/book"
              className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
            >
              hello@99knots.com
            </Link>
          </div>
        </div>

        <div className="mt-20 md:mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <span className="text-white/25 text-xs">
            &copy; 2025 99 knots. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/25 text-xs hover:text-white/50 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
