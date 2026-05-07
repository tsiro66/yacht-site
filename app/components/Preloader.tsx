"use client";

import { useEffect, useRef, useId } from "react";
import gsap from "gsap";

export default function Preloader() {
  const outerRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const oSpanRef = useRef<HTMLSpanElement>(null);
  const ellipseRef = useRef<SVGEllipseElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null); // Option 3: Ref for timeline
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

    // 1. Preload hero video
    const video = document.createElement("video");
    video.src = "/hero.mp4";
    video.preload = "auto";

    const videoReady = new Promise((resolve) => {
      video.oncanplaythrough = resolve;
    });

    // 2. Load custom font
    const fontReady = document.fonts.load("1em Google Sans").catch(() => {});

    // 3. Safety timeout
    const timeout = new Promise((resolve) => setTimeout(resolve, 1500));

    Promise.race([Promise.all([fontReady, videoReady]), timeout]).then(() => {
      // Check if the component is still mounted
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

      // Assign the timeline to the Ref
      tlRef.current = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          outer.style.display = "none";
        },
      });

      const tl = tlRef.current;

      chars.forEach((char, i) => {
        const fromAbove = i % 2 === 0;
        gsap.set(char, { y: fromAbove ? -40 : 40 });

        tl.to(
          char,
          { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" },
          i * 0.03,
        );
      });

      const entranceEnd = chars.length * 0.05 + 0.6;
      const holdEnd = entranceEnd + 0.2;

      tl.to(
        ellipse,
        {
          scale: 1,
          duration: 0.3,
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

      // Dispatch early so hero title fades in while ellipse still expanding
      tl.call(
        () => window.dispatchEvent(new CustomEvent("preloader:done")),
        [],
        zoomStart + zoomDuration * 0.45,
      );
    });

    return () => {
      // Use optional chaining on the ref to safely kill the animation
      tlRef.current?.kill();
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
        <span className="font-sans font-medium text-white text-5xl md:text-7xl lg:text-8xl tracking-wide">
          {brandChars.map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                charsRef.current[i] = el;
                if (char === "o" && i === 5) oSpanRef.current = el;
              }}
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