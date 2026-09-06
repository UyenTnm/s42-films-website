"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
      tl.set([letterSRef.current, dotRef.current, number42Ref.current, taglineRef.current], {
        opacity: 0,
        scale: 0.8,
      });

      // 2. Tiny signal pulse
      tl.to(signalRef.current, {
        scale: 1.5,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });
      tl.to(signalRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });

      // 3. S appears
      tl.to(letterSRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(2)",
      });

      // 4. Dot appears
      tl.to(dotRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(3)",
      });

      // 5. 42 appears
      tl.to(number42Ref.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(2)",
      });

      // 6. Subline reveals
      tl.to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      }, "+=0.2");

      // 7. Screen opens
      tl.to([letterSRef.current, dotRef.current, number42Ref.current, taglineRef.current], {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power3.in",
      }, "+=0.8");

      tl.to(curtainRef.current, {
        yPercent: -100,
        duration: 0.9,
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
        className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center"
      >
        {/* Signal indicator */}
        <div
          ref={signalRef}
          className="w-3 h-3 rounded-full bg-[#00f0ff] opacity-0 shadow-[0_0_20px_#00f0ff]"
        />

        {/* Brand S•42 Reveal */}
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
