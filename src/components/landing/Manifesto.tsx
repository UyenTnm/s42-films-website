"use client";

import { useRef } from "react";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import gsap from "gsap";

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      gsap.fromTo(
        ".manifesto-line",
        { opacity: 0.15, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 65%",
            scrub: 1,
          },
        }
      );
    },
    sectionRef,
    []
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="py-24 sm:py-32 md:py-36 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-white/[0.08] bg-[#060606] relative overflow-hidden"
    >
      {/* Illuminated 42 Watermark Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none -z-0">
        <span className="font-heading font-ethnocentric text-[180px] sm:text-[280px] md:text-[380px] lg:text-[440px] font-black text-white/[0.02] tracking-tighter block leading-none">
          42
        </span>
      </div>

      {/* Ambient radial lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none blur-[140px] opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(201,168,76,0.08) 50%, transparent 80%)",
        }}
      />

      <div className="w-full max-w-[1440px] mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Section Label Header - Full Width */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6 w-full">
          <div className="flex items-center gap-4">
            <span className="font-heading font-ethnocentric text-xs sm:text-sm tracking-[0.25em] text-[#f1f1ed]">
              01 // THE S•42 PROMISE
            </span>
          </div>
          <div className="flex items-center gap-3 font-sans text-xs tracking-widest text-[#888] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>CANONICAL PROTOCOL · 42 ORIGINAL PRODUCTIONS</span>
          </div>
        </div>

        {/* Core Statement - Full Width */}
        <div className="space-y-8 w-full">
          <div className="space-y-4 w-full">
            <h2 className="manifesto-line font-heading font-ethnocentric text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-wide leading-tight">
              FORTY-TWO STORIES.
            </h2>
            <p className="manifesto-line font-sans text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#a0a09c] font-light italic leading-tight">
              42 great stories worth remembering.
            </p>
          </div>

          <p className="manifesto-line font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#8e8e88] leading-relaxed font-light pt-4 w-full">
            S•42 was founded on a singular cinematic commitment: forty-two original feature films and limited series, each conceived with unyielding artistic conviction. No manufactured franchises. No filler. Forty-two self-contained worlds, each engineered to endure.
          </p>
        </div>
      </div>
    </section>
  );
}
