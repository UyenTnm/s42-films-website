"use client";

import Link from "next/link";
import { films } from "@/data/films";

export default function SignalSection() {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-[#060606] border-t border-white/[0.08] overflow-hidden relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-heading font-ethnocentric text-xs sm:text-sm tracking-[0.25em] text-[#f1f1ed]">
              03 // CANONICAL LOGLINES
            </span>
          </div>
          <span className="font-sans text-xs text-[#898989] font-light tracking-wider uppercase">
            DISTINCT PREMISES · 07 ACTIVE PRODUCTIONS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {films.map((film) => (
            <Link
              key={film.slug}
              href={`/films/${film.slug}`}
              className="group p-6 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 transition-all duration-400 flex flex-col justify-between space-y-4 shadow-lg hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="font-heading font-ethnocentric text-[10px] tracking-wider px-2 py-0.5 rounded border"
                    style={{
                      color: film.palette.accent,
                      borderColor: `${film.palette.accent}55`,
                    }}
                  >
                    {film.number}
                  </span>
                  <span className="font-heading font-ethnocentric text-[9px] text-[#666] tracking-wider uppercase">
                    {film.genre.split(" ")[0]}
                  </span>
                </div>

                <h3 className="font-heading font-ethnocentric text-sm sm:text-base text-white tracking-wide group-hover:translate-x-0.5 transition-transform">
                  {film.title}
                </h3>

                <blockquote className="font-sans text-xs sm:text-[13px] text-[#b0b0a8] italic font-light leading-relaxed">
                  &ldquo;{film.tagline}&rdquo;
                </blockquote>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-sans text-[11px] text-[#777]">
                <span>{film.format || "FEATURE FILM"}</span>
                <span className="font-heading font-ethnocentric text-[9px] text-[#f1f1ed] group-hover:text-white group-hover:translate-x-1 transition-transform">
                  VIEW →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
