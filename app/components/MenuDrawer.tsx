"use client";

import { useRef, useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const mainLinks = [
  { label: "Fleet", href: "/fleet" },
  { label: "Cruises", href: "/cruises" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

const secondaryLinks = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Psychology Today", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Accessibility", href: "#" },
];

interface MenuDrawerProps {
  theme?: "light" | "dark";
}

export default function MenuDrawer({ theme = "light" }: MenuDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const overlayRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isOpenRef = useRef(false);

  // Dynamic color based on theme and open state
  // Dark theme scroll = Black icon. Light theme scroll (or Open menu) = White icon.
  const iconColor = isOpen ? "#ffffff" : theme === "dark" ? "#1c1917" : "#ffffff";

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.inOut" },
        onStart: () => {
          document.body.style.overflow = "hidden";
        },
        onReverseComplete: () => {
          document.body.style.overflow = "";
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { visibility: "hidden" });
          }
        },
      });

      tl.set(overlayRef.current, { visibility: "visible" });

      tl.fromTo(
        layer1Ref.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 1 },
        0
      );

      tl.fromTo(
        layer2Ref.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 1 },
        0.15
      );

      tl.fromTo(
        layer3Ref.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 1 },
        0.3
      );

      tlRef.current = tl;
    });

    return () => ctx.revert();
  }, [mounted]);

  const toggleMenu = useCallback(() => {
    if (!tlRef.current) return;
    const opening = !isOpenRef.current;
    if (opening) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
    isOpenRef.current = opening;
    setIsOpen(opening);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpenRef.current) toggleMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggleMenu]);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="group relative flex items-center gap-3 z-10 cursor-pointer"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <div className="relative w-12 h-8 flex items-center justify-center">
          {/* Line 1 */}
          <span
            className="absolute overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.77,0,0.18,1)]"
            style={{
              width: isOpen ? "28px" : "40px",
              height: "2px",
              transform: isOpen
                ? "translateY(0) rotate(45deg)"
                : "translateY(-5px) rotate(0deg)",
            }}
          >
            <span
              className="block w-full h-full group-hover:animate-[rollLine_0.5s_ease-in-out]"
              style={{ backgroundColor: iconColor }}
            />
          </span>
          {/* Line 2 */}
          <span
            className="absolute overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.77,0,0.18,1)]"
            style={{
              width: isOpen ? "28px" : "40px",
              height: "2px",
              transform: isOpen
                ? "translateY(0) rotate(-45deg)"
                : "translateY(5px) rotate(0deg)",
            }}
          >
            <span 
              className="block w-full h-full group-hover:animate-[rollLine_0.5s_0.12s_ease-in-out]" 
              style={{ backgroundColor: iconColor }}
            />
          </span>
        </div>
        <span
          className={`hidden sm:inline text-lg font-medium tracking-wide transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          style={{ color: iconColor }}
        >
          Close
        </span>
      </button>

      {mounted &&
        createPortal(
          <div
            ref={overlayRef}
            className="fixed inset-0 z-[80]"
            style={{ visibility: "hidden" }}
          >
            <div
              ref={layer1Ref}
              className="absolute inset-0 bg-[var(--color-overlay-light)] will-change-[clip-path]"
              style={{ clipPath: "inset(0 0 100% 0)" }}
            />
            <div
              ref={layer2Ref}
              className="absolute inset-0 bg-[var(--color-overlay-medium)] will-change-[clip-path]"
              style={{ clipPath: "inset(0 0 100% 0)" }}
            />
            <div
              ref={layer3Ref}
              className="absolute inset-0 bg-[var(--color-overlay-dark)] will-change-[clip-path]"
              style={{ clipPath: "inset(0 0 100% 0)" }}
            >
              <div className="h-full flex flex-col px-6 md:px-10 lg:px-16">
                <div className="flex-1 flex items-center">
                  <nav className="flex flex-col py-20">
                    {mainLinks.map((link) => (
                      <div key={link.label}>
                        <a
                          href={link.href}
                          onClick={toggleMenu}
                          className="group/roll block overflow-hidden text-white tracking-tighter font-medium text-5xl sm:text-6xl md:text-7xl lg:text-9xl h-lh leading-16 md:leading-26"
                        >
                          <span className="block transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] group-hover/roll:-translate-y-[calc(100%+0.2em)]">
                            {link.label}
                          </span>
                          <span className="block mt-[0.2em] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] group-hover/roll:-translate-y-[calc(100%+0.2em)]" aria-hidden="true">
                            {link.label}
                          </span>
                        </a>
                      </div>
                    ))}
                  </nav>
                </div>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 md:pb-14">
                  <div className="flex gap-6">
                    {secondaryLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 text-sm md:text-base font-medium hover:text-white transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {legalLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="text-white/40 text-xs md:text-sm hover:text-white/70 transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}