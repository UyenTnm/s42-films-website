"use client";

import { useRef } from "react";
import Image from "next/image";
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
            <span>ACTIVE FILM ROSTER</span>
          </div>
          <div className="font-mono text-xs text-[#898989]">
            SHOWING 03 OF 42 PRODUCTIONS
          </div>
        </div>

        {/* Film Cards List with Posters */}
        <div className="grid grid-cols-1 gap-12">
          {films.map((film) => (
            <Link
              key={film.slug}
              href={`/films/${film.slug}`}
              className="film-card group relative block p-6 sm:p-8 md:p-12 rounded-xl border border-[#f1f1ed]/10 bg-[#0a0a0a] hover:border-[#f1f1ed]/30 hover:bg-[#0f0f0f] transition-all duration-500 overflow-hidden"
            >
              {/* Dynamic Accent Glow */}
              <div
                className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-0 group-hover:opacity-15 transition-opacity duration-700 blur-3xl pointer-events-none"
                style={{ backgroundColor: film.palette.accent }}
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Film Poster Thumbnail */}
                <div className="lg:col-span-4 xl:col-span-3">
                  <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-lg overflow-hidden border border-[#f1f1ed]/15 shadow-2xl bg-black">
                    <Image
                      src={film.posterImage}
                      alt={`${film.title} Poster`}
                      fill
                      sizes="(max-width: 768px) 260px, 320px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>

                {/* Film Details */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-widest text-[#898989]">
                    <span
                      className="font-bold text-sm px-2 py-0.5 rounded border"
                      style={{
                        borderColor: film.palette.accent,
                        color: film.palette.accent,
                      }}
                    >
                      {film.number}
                    </span>
                    <span>•</span>
                    <span>{film.genre}</span>
                    {film.format && (
                      <>
                        <span>•</span>
                        <span>{film.format}</span>
                      </>
                    )}
                    {film.setting && (
                      <>
                        <span>•</span>
                        <span>{film.setting}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#f1f1ed] group-hover:translate-x-1 transition-transform duration-300">
                    {film.title}
                  </h3>

                  {film.subtitle && (
                    <p
                      className="font-mono text-xs tracking-wider uppercase font-semibold"
                      style={{ color: film.palette.accent }}
                    >
                      {film.subtitle}
                    </p>
                  )}

                  {film.tagline && (
                    <p className="text-base md:text-lg italic text-[#d4d4cf] font-light">
                      &ldquo;{film.tagline}&rdquo;
                    </p>
                  )}

                  <p className="text-sm md:text-base text-[#898989] leading-relaxed max-w-3xl">
                    {film.logline}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#898989] border-t border-[#f1f1ed]/10">
                    <span>WRITTEN BY {film.creator.toUpperCase()}</span>
                    <div className="flex items-center gap-2 text-[#f1f1ed] group-hover:text-white transition-colors">
                      <span className="uppercase tracking-widest text-xs">Explore Project</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* 42 Protocol Slots Indicator */}
          <div className="p-8 md:p-10 rounded-lg border border-dashed border-[#f1f1ed]/10 bg-[#080808]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[#555]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#333]" />
              <span>SLOTS 04 — 42 // IN DEVELOPMENT PIPELINE</span>
            </div>
            <span className="text-[11px] text-[#444] uppercase tracking-wider">
              42 GREAT STORIES WORTH REMEMBERING
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
