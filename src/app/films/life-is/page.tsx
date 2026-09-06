import type { Metadata } from "next";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";

export const metadata: Metadata = {
  title: "03 — LIFE IS | S•42 Films",
  description:
    "An intimate tapestry of interconnected human lives navigating memory, impermanence, and the fleeting beauty of presence.",
};

export default function LifeIsPage() {
  const film = getFilmBySlug("life-is")!;

  return (
    <article
      data-theme="life-is"
      className="min-h-screen bg-[#0d0b09] text-[#f7ede2] relative overflow-hidden"
    >
      {/* Background Ambience / Warm Human Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(229,169,59,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(13,11,9,0.95))] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-6 md:px-16 pt-24 pb-20 max-w-7xl mx-auto flex flex-col justify-between min-h-[85vh]">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#e5a93b]/20 pb-6 font-mono text-xs tracking-widest text-[#e5a93b]/70">
          <div className="flex items-center gap-4">
            <span className="text-[#e5a93b] font-bold text-sm">ARCHIVE // {film.number}</span>
            <span>•</span>
            <span>{film.status.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>GENRE // {film.genre?.toUpperCase()}</span>
            <span>•</span>
            <span>EST. {film.year}</span>
          </div>
        </div>

        {/* Title Area */}
        <div className="my-auto py-12 space-y-6">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded bg-[#e5a93b]/10 border border-[#e5a93b]/30 text-xs font-mono text-[#e5a93b]">
            <span className="w-2 h-2 rounded-full bg-[#e5a93b] animate-pulse" />
            HUMAN FRAGILITY RECORD
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif italic tracking-tight text-white leading-none">
            LIFE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93b] via-[#ffe0a3] to-white font-sans font-extrabold not-italic">
              IS.
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-2xl text-[#d4c3b3] font-light leading-relaxed">
            {film.logline}
          </p>
        </div>

        {/* Bottom Actions & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#e5a93b]/20 font-mono text-xs">
          <div>
            <span className="text-[#898989] block mb-1">MEDITATION</span>
            <p className="text-[#f7ede2] leading-relaxed">
              Moments that disappear before we understand their weight: childhood dust, missed flights, late night calls.
            </p>
          </div>
          <div>
            <span className="text-[#898989] block mb-1">AESTHETIC WORLD</span>
            <p className="text-[#e5a93b] leading-relaxed">
              35mm film grain, sepia-amber sunsets, soft dust particles, acoustic resonances, and lingering human glances.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-3 md:items-end">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded border border-[#e5a93b]/40 bg-[#e5a93b]/10 hover:bg-[#e5a93b] hover:text-black text-[#e5a93b] font-mono text-xs uppercase tracking-widest transition-all duration-300"
            >
              ← Return to Index
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
