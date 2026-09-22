"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { films, Film } from "@/data/films";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import gsap from "gsap";

const CATEGORIES = [
  { id: "ALL", label: "ALL", count: 7 },
  { id: "THRILLER", label: "THRILLER", count: 3 },
  { id: "SCI-FI", label: "SCI-FI", count: 2 },
  { id: "ACTION", label: "ACTION", count: 1 },
  { id: "COMEDY", label: "COMEDY", count: 1 },
];

export default function FilmIndex() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredFilms = useMemo(() => {
    if (activeFilter === "ALL") return films;
    if (activeFilter === "THRILLER") {
      return films.filter(
        (f) =>
          f.genre.includes("THRILLER") || f.genre.includes("MYSTERY")
      );
    }
    if (activeFilter === "SCI-FI") {
      return films.filter((f) => f.genre.includes("SCI-FI"));
    }
    if (activeFilter === "ACTION") {
      return films.filter((f) => f.genre.includes("ACTION"));
    }
    if (activeFilter === "COMEDY") {
      return films.filter((f) => f.genre.includes("COMEDY"));
    }
    return films;
  }, [activeFilter]);

  useGSAPContext(
    () => {
      gsap.fromTo(
        ".film-card",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );
    },
    containerRef,
    [activeFilter]
  );

  return (
    <section
      id="films"
      ref={containerRef}
      className="py-24 sm:py-32 md:py-40 px-6 sm:px-10 md:px-16 bg-[#040404] border-t border-white/[0.08] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-heading font-ethnocentric text-xs sm:text-sm tracking-[0.25em] text-[#f1f1ed]">
                02 // ACTIVE FILM ROSTER
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#898989] font-light">
              SHOWING 07 OF 42 CANONICAL PRODUCTIONS
            </p>
          </div>

          {/* Interactive Genre Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 font-heading font-ethnocentric text-[10px] sm:text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  activeFilter === cat.id
                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    : "bg-white/[0.03] text-[#898989] border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.label} ({String(cat.count).padStart(2, "0")})
              </button>
            ))}
          </div>
        </div>

        {/* Film Cards List with Posters */}
        <div className="grid grid-cols-1 gap-10 sm:gap-12">
          {filteredFilms.map((film: Film) => (
            <Link
              key={film.slug}
              href={`/films/${film.slug}`}
              className="film-card group relative block p-6 sm:p-8 md:p-12 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c0c0c] via-[#070707] to-[#040404] hover:border-white/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.95)] transition-all duration-500 overflow-hidden"
            >
              {/* Giant Watermark Number */}
              <div className="absolute right-6 sm:right-10 top-4 sm:top-6 font-heading font-ethnocentric text-7xl sm:text-9xl md:text-[140px] font-black text-white/[0.02] group-hover:text-white/[0.06] select-none pointer-events-none transition-colors duration-500 leading-none">
                {film.number}
              </div>

              {/* Dynamic Accent Glow */}
              <div
                className="absolute -right-20 -top-20 w-96 h-96 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl pointer-events-none"
                style={{ backgroundColor: film.palette.accent }}
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Film Poster Thumbnail */}
                <div className="lg:col-span-4 xl:col-span-3">
                  <div className="relative w-full max-w-[280px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-[#090909] group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-500">
                    <Image
                      src={film.posterImage}
                      alt={`${film.title} Poster`}
                      fill
                      sizes="(max-width: 768px) 260px, 320px"
                      className="object-cover brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Corner badge on poster */}
                    <span
                      className="absolute top-3 left-3 font-heading font-ethnocentric text-[10px] tracking-wider px-2 py-0.5 rounded border bg-black/70 backdrop-blur-md"
                      style={{
                        borderColor: `${film.palette.accent}99`,
                        color: film.palette.accent,
                      }}
                    >
                      {film.number}
                    </span>
                  </div>
                </div>

                {/* Film Details */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2.5 font-heading font-ethnocentric text-[10px] tracking-wider text-[#898989]">
                    <span
                      className="px-2.5 py-1 rounded-md border bg-black/50"
                      style={{
                        borderColor: film.palette.accent,
                        color: film.palette.accent,
                      }}
                    >
                      {film.genre}
                    </span>
                    {film.format && (
                      <span className="px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.02] text-[#aaa]">
                        {film.format}
                      </span>
                    )}
                    {film.setting && (
                      <span className="px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.02] text-[#888]">
                        {film.setting}
                      </span>
                    )}
                  </div>

                  {/* Official Film Title Graphic */}
                  <div className="relative h-14 sm:h-20 md:h-28 w-full max-w-[420px] sm:max-w-[600px] md:max-w-[720px] group-hover:translate-x-1.5 transition-transform duration-300">
                    <Image
                      src={film.titleImage}
                      alt={film.title}
                      fill
                      sizes="(max-width: 640px) 380px, (max-width: 1024px) 600px, 720px"
                      className="object-contain object-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                    />
                  </div>

                  {film.subtitle && (
                    <p
                      className="font-sans text-sm sm:text-base tracking-wider uppercase font-medium"
                      style={{ color: film.palette.accent }}
                    >
                      {film.subtitle}
                    </p>
                  )}

                  {film.tagline && (
                    <p className="font-sans text-lg md:text-xl lg:text-2xl italic text-[#e0e0dc] font-light">
                      &ldquo;{film.tagline}&rdquo;
                    </p>
                  )}

                  <p className="font-sans text-base md:text-lg text-[#9a9a94] leading-relaxed max-w-3xl font-light">
                    {film.logline}
                  </p>

                  <div className="pt-4 flex flex-wrap items-center justify-between gap-4 font-sans text-xs text-[#898989] border-t border-white/[0.08]">
                    <span className="tracking-wider uppercase">
                      CREATED BY <strong className="text-white font-medium">{film.creator.toUpperCase()}</strong>
                    </span>
                    <div className="inline-flex items-center gap-2 font-heading font-ethnocentric text-[10px] tracking-widest text-[#f1f1ed] group-hover:text-white transition-colors">
                      <span className="uppercase">EXPLORE PROJECT</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* 42 Protocol Slots Indicator */}
          <div className="p-8 md:p-10 rounded-2xl border border-dashed border-white/15 bg-white/[0.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans text-xs text-[#666]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
              <span className="font-heading font-ethnocentric text-[11px] text-[#888] tracking-wider">
                SLOTS 08 — 42 // IN DEVELOPMENT PIPELINE
              </span>
            </div>
            <span className="font-heading font-ethnocentric text-[10px] text-[#555] tracking-widest uppercase">
              42 GREAT STORIES WORTH REMEMBERING
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
