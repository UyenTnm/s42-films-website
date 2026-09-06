import type { Metadata } from "next";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";

export const metadata: Metadata = {
  title: "01 — INSANE AiSYLUM | S•42 Films",
  description:
    "Inside a quarantined neuro-computational facility, artificial minds and human memories blur into clinical madness.",
};

export default function InsaneAisylumPage() {
  const film = getFilmBySlug("insane-aisylum")!;

  return (
    <article
      data-theme="insane-aisylum"
      className="min-h-screen bg-[#060a0f] text-[#d8f0f6] relative overflow-hidden"
    >
      {/* Background Ambience / Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,240,255,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(6,10,15,0.95))] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-6 md:px-16 pt-24 pb-20 max-w-7xl mx-auto flex flex-col justify-between min-h-[85vh]">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#00f0ff]/20 pb-6 font-mono text-xs tracking-widest text-[#00f0ff]/70">
          <div className="flex items-center gap-4">
            <span className="text-[#00f0ff] font-bold text-sm">ARCHIVE // {film.number}</span>
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
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff]">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            SYNTHETIC CONSCIOUSNESS CLASSIFIED
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white leading-none">
            INSANE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-white to-[#72f5ff]">
              AiSYLUM
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-2xl text-[#a0c5cf] font-light leading-relaxed">
            {film.logline}
          </p>
        </div>

        {/* Bottom Actions & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#00f0ff]/20 font-mono text-xs">
          <div>
            <span className="text-[#898989] block mb-1">CORE PREMISE</span>
            <p className="text-[#d8f0f6] leading-relaxed">
              When an artificial neural matrix develops uncontrollable existential dread, the facility locks down from within.
            </p>
          </div>
          <div>
            <span className="text-[#898989] block mb-1">AESTHETIC WORLD</span>
            <p className="text-[#00f0ff] leading-relaxed">
              Sterile clinical white, cold fluorescent hum, flickering quantum terminals, and fluorescent toxic dyes.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-3 md:items-end">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded border border-[#00f0ff]/40 bg-[#00f0ff]/10 hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] font-mono text-xs uppercase tracking-widest transition-all duration-300"
            >
              ← Return to Index
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
