"use client";

import { useRef } from "react";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import gsap from "gsap";

const PILLARS = [
  {
    num: "01",
    title: "GENRE INTEGRITY",
    desc: "Every title commits unreservedly to its genre rules—whether psychological supernatural thriller, near-future sci-fi, dark comedy-drama, or survival action.",
    accent: "#e50914",
  },
  {
    num: "02",
    title: "STANDALONE CANON",
    desc: "Zero filler. Zero mandatory prerequisites. Every film is a complete, self-contained story built with definitive consequence and emotional resonance.",
    accent: "#c9a84c",
  },
  {
    num: "03",
    title: "THE 42 ARCHIVE",
    desc: "A deliberate, finite catalog of exactly 42 seminal productions. Once the forty-second story concludes, the S•42 canon is sealed as a permanent cinematic legacy.",
    accent: "#4a9eda",
  },
  {
    num: "04",
    title: "ORIGINAL DNA",
    desc: "Created and curated by Wesley Anton Dadwah, bridging high-concept speculative premises with intense psychological depth and universal human truths.",
    accent: "#e8c44a",
  },
];

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
      className="py-24 sm:py-32 md:py-40 px-6 sm:px-10 md:px-16 border-t border-white/[0.08] bg-[#060606] relative overflow-hidden"
    >
      {/* Illuminated 42 Watermark Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none -z-0">
        <span className="font-heading font-ethnocentric text-[180px] sm:text-[280px] md:text-[380px] font-black text-white/[0.02] tracking-tighter block leading-none">
          42
        </span>
      </div>

      {/* Ambient radial lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none blur-[140px] opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(201,168,76,0.08) 50%, transparent 80%)",
        }}
      />

      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20 relative z-10">
        {/* Section Label Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
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

        {/* Core Statement */}
        <div className="space-y-6 max-w-4xl">
          <div className="space-y-2">
            <h2 className="manifesto-line font-heading font-ethnocentric text-3xl sm:text-5xl md:text-6xl text-white tracking-wide leading-tight">
              FORTY-TWO STORIES.
            </h2>
            <p className="manifesto-line font-sans text-2xl sm:text-4xl md:text-5xl text-[#a0a09c] font-light italic leading-tight">
              42 great stories worth remembering.
            </p>
          </div>

          <p className="manifesto-line font-sans text-base sm:text-lg md:text-xl text-[#8e8e88] leading-relaxed font-light pt-2 max-w-3xl">
            S•42 was founded on a singular cinematic commitment: forty-two original feature films and limited series, each conceived with unyielding artistic conviction. No manufactured franchises. No filler. Forty-two self-contained worlds, each engineered to endure.
          </p>
        </div>

        {/* 4 Foundational Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.num}
              className="group relative p-6 sm:p-7 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-400 space-y-3.5 shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-heading font-ethnocentric text-xs tracking-wider px-2 py-0.5 rounded border"
                  style={{
                    color: pillar.accent,
                    borderColor: `${pillar.accent}55`,
                  }}
                >
                  {pillar.num}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/60 transition-colors" />
              </div>

              <h3 className="font-heading font-ethnocentric text-sm text-white tracking-wider group-hover:translate-x-0.5 transition-transform">
                {pillar.title}
              </h3>

              <p className="font-sans text-xs sm:text-[13px] text-[#8e8e88] leading-relaxed font-light">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Studio Status Seal Bar */}
        <div className="p-6 sm:p-8 rounded-xl border border-white/[0.08] bg-gradient-to-r from-black/80 via-[#0d0d0d] to-black/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-heading font-ethnocentric text-xs text-white/80 shrink-0">
              42
            </div>
            <div>
              <div className="font-heading font-ethnocentric text-xs tracking-wider text-white">
                CURRENT CATALOG STATUS
              </div>
              <p className="font-sans text-xs text-[#898989] font-light">
                07 ACTIVE PRODUCTIONS UNVEILED · 35 IN CURATION
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-sans text-xs text-[#a0a09c]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>07 Revealed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>35 Pipeline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/40" />
              <span>100% Original</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
