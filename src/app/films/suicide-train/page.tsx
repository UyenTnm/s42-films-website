import type { Metadata } from "next";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";

export const metadata: Metadata = {
  title: "02 — SUICIDE TRAIN | S•42 Films",
  description:
    "A high-velocity locomotive hurtles across a decaying industrial wasteland with passengers bound to an irreversible destination.",
};

export default function SuicideTrainPage() {
  const film = getFilmBySlug("suicide-train")!;

  return (
    <article
      data-theme="suicide-train"
      className="min-h-screen bg-[#0a0707] text-[#f2dede] relative overflow-hidden"
    >
      {/* Background Ambience / Industrial Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,42,42,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(10,7,7,0.95))] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-6 md:px-16 pt-24 pb-20 max-w-7xl mx-auto flex flex-col justify-between min-h-[85vh]">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#ff2a2a]/20 pb-6 font-mono text-xs tracking-widest text-[#ff2a2a]/70">
          <div className="flex items-center gap-4">
            <span className="text-[#ff2a2a] font-bold text-sm">ARCHIVE // {film.number}</span>
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
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-xs font-mono text-[#ff2a2a]">
            <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-ping" />
            LOCOMOTIVE TELEMETRY OVERRIDDEN
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white leading-none">
            SUICIDE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a2a] via-[#ff6b6b] to-white">
              TRAIN
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-2xl text-[#d4b0b0] font-light leading-relaxed">
            {film.logline}
          </p>
        </div>

        {/* Bottom Actions & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#ff2a2a]/20 font-mono text-xs">
          <div>
            <span className="text-[#898989] block mb-1">TERMINAL VELOCITY</span>
            <p className="text-[#f2dede] leading-relaxed">
              400 km/h without automated braking. The only choice left for those on board is confronting why they boarded.
            </p>
          </div>
          <div>
            <span className="text-[#898989] block mb-1">AESTHETIC WORLD</span>
            <p className="text-[#ff4444] leading-relaxed">
              Gritty brushed steel, soot, signal lamps cutting through black rain, industrial noise, and unrelenting motion.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-3 md:items-end">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded border border-[#ff2a2a]/40 bg-[#ff2a2a]/10 hover:bg-[#ff2a2a] hover:text-black text-[#ff2a2a] font-mono text-xs uppercase tracking-widest transition-all duration-300"
            >
              ← Return to Index
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
