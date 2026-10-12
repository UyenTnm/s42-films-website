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
              01 // S•42 — STUDIO 42
            </span>
          </div>
          <div className="flex items-center gap-3 font-sans text-xs tracking-widest text-[#888] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>THE S•42 PROMISE · 42 ORIGINAL STORIES</span>
          </div>
        </div>

        {/* Core Statement - Full Width */}
        <div className="space-y-8 w-full">
          <div className="space-y-4 w-full">
            <h2 className="manifesto-line font-heading font-ethnocentric text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-wide leading-tight">
              FORTY-TWO STORIES.
            </h2>
            <p className="manifesto-line font-sans text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#a0a09c] font-light italic leading-tight">
              Infinite Possibilities. One Enduring Legacy.
            </p>
          </div>

          <p className="manifesto-line font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#8e8e88] leading-relaxed font-light pt-4 w-full">
            Studio 42 was founded on a singular creative commitment: to develop
            forty-two exceptional original stories, each conceived with
            uncompromising artistic ambition and the potential to captivate,
            inspire, and leave a lasting impression.
          </p>

          <div className="manifesto-line border-l border-[#c9a84c]/40 pl-5 sm:pl-7">
            <p className="font-sans text-lg sm:text-xl md:text-2xl text-[#f1f1ed] font-semibold leading-relaxed">
              Every story must earn its place. Because there will only ever be
              forty-two.
            </p>
          </div>

          <div className="space-y-5 font-sans text-base sm:text-lg md:text-xl text-[#9a9a94] leading-relaxed font-light">
            <p className="manifesto-line">
              But our vision extends far beyond the stories themselves.
            </p>
            <p className="manifesto-line">
              Studio 42 is building a new kind of independent entertainment
              studio — creating original worlds, developing virtual stars,
              producing films and series, and connecting directly with
              audiences worldwide.
            </p>
            <p className="manifesto-line">
              Combining cinematic storytelling with artificial intelligence
              and emerging technologies, we are expanding the boundaries of
              how entertainment is imagined, created, and experienced.
            </p>
            <p className="manifesto-line">
              Our ambition is to build more than individual films: stories that
              evolve across genres and platforms, virtual performers who become
              recognizable stars, and original creations with the potential to
              grow into lasting entertainment franchises.
            </p>
            <p className="manifesto-line">
              Through independent production and strategic partnerships, we aim
              to reach global audiences while retaining creative control,
              protecting our intellectual property, and building long-term
              value.
            </p>
          </div>

          <div className="manifesto-line space-y-2 pt-3 font-heading font-ethnocentric text-base sm:text-lg md:text-xl text-[#c9a84c] tracking-[0.08em] leading-relaxed">
            <p>Imagination defines what is worth creating.</p>
            <p>
              Technology expands what is possible. Storytelling remains at the
              heart of everything we do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
