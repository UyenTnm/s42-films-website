"use client";

import { useRef } from "react";
import Link from "next/link";
import { films } from "@/data/films";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import gsap from "gsap";

export default function FilmIndex() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      gsap.fromTo(
        ".film-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );
    },
    containerRef,
    []
  );

  return (
    <section
      id="films"
      ref={containerRef}
      className="py-24 md:py-36 px-6 md:px-16 bg-[#050505] border-t border-[#f1f1ed]/10 relative"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#f1f1ed]/10 pb-6">
          <div className="flex items-center gap-4 font-mono text-xs text-[#898989] tracking-widest uppercase">
            <span className="text-[#f1f1ed]">02 //</span>
            <span>ACTIVE ROSTER & ARCHIVE</span>
          </div>
          <div className="font-mono text-xs text-[#898989]">
            SHOWING 03 OF 42 PRODUCTIONS
          </div>
        </div>

        {/* Film Cards List */}
        <div className="grid grid-cols-1 gap-6">
          {films.map((film) => (
            <Link
              key={film.slug}
              href={`/films/${film.slug}`}
              className="film-card group relative block p-8 md:p-12 rounded-lg border border-[#f1f1ed]/10 bg-[#0a0a0a] hover:border-[#f1f1ed]/30 hover:bg-[#111] transition-all duration-500 overflow-hidden"
            >
              {/* Accent Glow on Hover */}
              <div
                className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-0 group-hover:opacity-15 transition-opacity duration-700 blur-3xl pointer-events-none"
                style={{ backgroundColor: film.palette.accent }}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Number & Title */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-[#898989]">
                    <span
                      className="font-bold text-sm"
                      style={{ color: film.palette.accent }}
                    >
                      FILM {film.number}
                    </span>
                    <span>•</span>
                    <span>{film.genre?.toUpperCase()}</span>
                    <span>•</span>
                    <span>{film.status.toUpperCase()}</span>
                  </div>

                  <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#f1f1ed] group-hover:translate-x-2 transition-transform duration-300">
                    {film.title}
                  </h3>

                  <p className="text-sm md:text-base text-[#898989] max-w-2xl pt-1">
                    {film.logline}
                  </p>
                </div>

                {/* Arrow / Explore CTA */}
                <div className="flex items-center gap-4 font-mono text-xs text-[#898989] group-hover:text-[#f1f1ed] transition-colors self-start md:self-center">
                  <span className="uppercase tracking-widest">Enter Film World</span>
                  <div
                    className="w-10 h-10 rounded-full border border-[#f1f1ed]/20 flex items-center justify-center group-hover:border-[#f1f1ed] group-hover:bg-[#f1f1ed] group-hover:text-[#050505] transition-all duration-300"
                  >
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Scalable Classified Roster Slots Placeholder */}
          <div className="p-8 md:p-10 rounded-lg border border-dashed border-[#f1f1ed]/10 bg-[#080808]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[#555]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#333]" />
              <span>SLOTS 04 — 42 // CLASSIFIED IN SELECTION PIPELINE</span>
            </div>
            <span className="text-[11px] text-[#444] uppercase tracking-wider">
              RESERVED UNDER THE 42 PROTOCOL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
