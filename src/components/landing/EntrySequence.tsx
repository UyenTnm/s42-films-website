"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import gsap from "gsap";

interface EntrySequenceProps {
  onComplete?: () => void;
}

function subscribeSession(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSeenSnapshot() {
  return typeof window !== "undefined" && Boolean(sessionStorage.getItem("s42_entry_seen"));
}

function getServerSnapshot() {
  return false;
}

export default function EntrySequence({ onComplete }: EntrySequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const letterSRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const number42Ref = useRef<HTMLSpanElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  const hasSeen = useSyncExternalStore(subscribeSession, getSeenSnapshot, getServerSnapshot);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (hasSeen) {
      onComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("s42_entry_seen", "1");
          setIsFinished(true);
          onComplete?.();
        },
      });

      // 1. Initial state
      tl.set(
        [
          letterSRef.current,
          dotRef.current,
          number42Ref.current,
          logoWrapperRef.current,
          taglineRef.current,
        ],
        {
          opacity: 0,
          scale: 0.9,
        }
      );

      // 2. Tiny signal pulse
      tl.to(signalRef.current, {
        scale: 1.5,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });
      tl.to(signalRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });

      // 3. S appears
      tl.to(letterSRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(2)",
      });

      // 4. Dot appears
      tl.to(dotRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: "back.out(3)",
      });

      // 5. 42 appears
      tl.to(number42Ref.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(2)",
      });

      // 6. Crossfade into official metallic S•42 logo
      tl.to([letterSRef.current, dotRef.current, number42Ref.current], {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
      }, "+=0.2");

      tl.to(logoWrapperRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.15");

      // 7. Subline reveals
      tl.to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "+=0.1");

      // 8. Curtain reveals page
      tl.to([logoWrapperRef.current, taglineRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power3.in",
      }, "+=0.6");

      tl.to(curtainRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasSeen, onComplete]);

  if (hasSeen || isFinished) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center overflow-hidden"
    >
      {/* Curtain Layer */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center p-6"
      >
        {/* Signal indicator */}
        <div
          ref={signalRef}
          className="w-3 h-3 rounded-full bg-[#f1f1ed] opacity-0 shadow-[0_0_20px_#f1f1ed]"
        />

        {/* Initial glyph reveal */}
        <div className="flex items-center text-5xl md:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-[#f1f1ed]">
          <span ref={letterSRef} className="inline-block">
            S
          </span>
          <span
            ref={dotRef}
            className="inline-block mx-3 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#f1f1ed]"
          />
          <span ref={number42Ref} className="inline-block">
            42
          </span>
        </div>

        {/* Official S•42 Metallic Logo Crossfade */}
        <div
          ref={logoWrapperRef}
          className="relative w-64 h-24 sm:w-80 sm:h-32 -mt-16 sm:-mt-20 opacity-0"
        >
          <Image
            src="/images/brand/logo.png"
            alt="S•42 FILMS"
            fill
            sizes="320px"
            className="object-contain"
            priority
          />
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mt-6 text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-[#898989] translate-y-4 opacity-0 text-center px-4"
        >
          42 great stories worth remembering.
        </p>
      </div>
    </div>
  );
}
