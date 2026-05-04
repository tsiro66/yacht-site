"use client";

import { useEffect, useRef, useId } from "react";
import gsap from "gsap";

export default function Preloader() {
  const outerRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const oSpanRef = useRef<HTMLSpanElement>(null);
  const ellipseRef = useRef<SVGEllipseElement>(null);
  const maskId = useId();

  const brandChars = "99 knots".split("");

  useEffect(() => {
    const outer = outerRef.current;
    const textGroup = textGroupRef.current;
    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    const oSpan = oSpanRef.current;
    const ellipse = ellipseRef.current;
    if (!outer || !textGroup || !chars.length || !oSpan || !ellipse) return;

    document.body.style.overflow = "hidden";

    let tl: gsap.core.Timeline | null = null;

    // 1. Preload hero image
    const video = document.createElement("video");
    video.src = "/hero.mp4";
    video.preload = "auto";

    const videoReady = new Promise((resolve) => {
      video.oncanplaythrough = resolve;
    });

    // 2. Explicitly load your custom font
    // Replace "Hero Font Name" with the exact name of the font-family in your CSS
    const fontReady = document.fonts.load("1em --font-hero").catch(() => {});

    const timeout = new Promise((resolve) => setTimeout(resolve, 3000));

    // 3. Wait for BOTH the image and the specific font (or timeout)
    Promise.race([Promise.all([fontReady, videoReady]), timeout]).then(() => {
      if (!outer.isConnected) return;

      const oRect = oSpan.getBoundingClientRect();
      const oCx = oRect.left + oRect.width / 2;
      const oCy = oRect.top + oRect.height * 0.58;
      const counterR = oRect.width * 0.34;

      textGroup.style.transformOrigin = `${oCx}px ${oCy}px`;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxCornerDist = Math.sqrt(
        Math.max(oCx, vw - oCx) ** 2 + Math.max(oCy, vh - oCy) ** 2,
      );
      const S = Math.ceil(maxCornerDist / counterR) + 50;

      gsap.set(ellipse, {
        attr: { cx: oCx, cy: oCy, rx: counterR, ry: counterR },
        scale: 0,
        transformOrigin: `${oCx}px ${oCy}px`,
      });

      tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          outer.style.display = "none";
          window.dispatchEvent(new CustomEvent("preloader:done"));
        },
      });

      chars.forEach((char, i) => {
        const fromAbove = i % 2 === 0;

        // We no longer need to set opacity: 0 here because it's in the CSS.
        // Just set the starting Y position.
        gsap.set(char, { y: fromAbove ? -40 : 40 });

        tl.to(
          char,
          { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" },
          i * 0.05,
        );
      });

      const entranceEnd = chars.length * 0.05 + 0.6;
      const holdEnd = entranceEnd + 0.2;

      tl.to(
        ellipse,
        {
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.5)",
        },
        holdEnd,
      );

      const zoomStart = holdEnd + 0.2;
      const zoomDuration = 1.2;

      tl.to(
        [textGroup, ellipse],
        {
          scale: S,
          duration: zoomDuration,
          ease: "expo.inOut",
        },
        zoomStart,
      );

      tl.to(
        textGroup,
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        zoomStart + zoomDuration - 0.3,
      );
    });

    return () => {
      tl?.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-transparent"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            <ellipse
              ref={ellipseRef}
              cx="0"
              cy="0"
              rx="0"
              ry="0"
              fill="black"
              style={{ willChange: "transform" }}
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="#0a1128"
          mask={`url(#${maskId})`}
        />
      </svg>

      <div
        ref={textGroupRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        <span className="font-hero text-white text-5xl md:text-7xl lg:text-8xl tracking-wide">
          {brandChars.map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                charsRef.current[i] = el;
                if (char === "o" && i === 5) oSpanRef.current = el;
              }}
              // CRITICAL ADDITION: opacity-0 added here so the DOM paints it invisible first
              className="inline-block opacity-0"
              style={char === " " ? { width: "0.3em" } : undefined}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
