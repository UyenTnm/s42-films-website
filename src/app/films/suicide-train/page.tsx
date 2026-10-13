import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";
import BackToHomeLink from "@/components/navigation/BackToHomeLink";
import FilmStorySections from "@/components/films/FilmStorySections";

export const metadata: Metadata = {
  title: "02 — SUICIDE TRAIN | S•42 Films",
  description:
    "An American military family of three accidentally completes the count aboard a secret suicide train and has four hours to escape before it plunges into the ocean.",
};

export default function SuicideTrainPage() {
  const film = getFilmBySlug("suicide-train")!;

  return (
    <article
      data-theme="suicide-train"
      className="min-h-screen bg-[#080606] text-[#e8dede] relative overflow-hidden"
    >
      {/* Signal Red Atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-radial from-[#e52222]/[0.08] via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-24 space-y-16">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between border-b border-[#e52222]/20 pb-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#898989]">
            <Link href="/" className="hover:text-[#f1f1ed] transition-colors">
              S•42 FILMS
            </Link>
            <span>/</span>
            <span className="text-[#e52222] font-bold">FILM {film.number}</span>
          </div>

          {/* <Link
            href="/#films"
            className="relative z-[60] pointer-events-auto cursor-pointer text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200 uppercase tracking-widest"
          >
            ← All Films
          </Link> */}
          <BackToHomeLink className="relative z-[60] pointer-events-auto cursor-pointer text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200 uppercase tracking-widest">
            ← All Films
          </BackToHomeLink>
        </div>

        {/* Main Content Layout: Poster + Narrative Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Official Poster */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-[0_0_40px_rgba(229,34,34,0.15)] bg-black">
              <Image
                src={film.posterImage}
                alt="SUICIDE TRAIN Official Poster"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
                priority
              />
            </div>
            <p className="font-mono text-[10px] text-[#898989] tracking-widest text-center uppercase">
              TOKYO BAY • 終点 FINAL STOP • TRAIN 42
            </p>
          </div>

          {/* Right Column: Narrative Structure */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-10">
            {/* Header Titles */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e52222]/10 font-mono text-xs text-[#e52222] tracking-widest uppercase font-semibold">
                FILM {film.number} {"//"} S•42
              </div>

              {/* Official Film Title Graphic */}
              <div className="relative h-20 sm:h-28 md:h-36 lg:h-40 w-full max-w-[550px] sm:max-w-[750px] md:max-w-[900px]">
                <Image
                  src={film.titleImage}
                  alt={film.title}
                  fill
                  sizes="(max-width: 640px) 550px, 900px"
                  className="object-contain object-left [filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.75))]"
                  priority
                />
              </div>

              <h2 className="font-mono text-sm sm:text-base text-[#a3a3a3] tracking-widest uppercase font-medium">
                {film.subtitle}
              </h2>
            </div>

            {/* Production Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-lg border border-[#e52222]/20 bg-[#0d0909] font-mono text-xs">
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">FORMAT</span>
                <span className="text-[#f1f1ed] font-semibold text-sm">{film.format}</span>
              </div>
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">SETTING</span>
                <span className="text-[#f1f1ed] font-semibold text-sm">{film.setting}</span>
              </div>
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">GENRE</span>
                <span className="text-[#f1f1ed] font-semibold text-sm">{film.genre}</span>
              </div>
            </div>

            {/* Three Core Numbers Banner */}
            <div className="grid grid-cols-3 gap-3 p-4 sm:p-6 rounded-lg border border-[#e52222]/20 bg-[#0d0909] text-center font-mono">
              <div className="space-y-1">
                <span className="block text-3xl sm:text-5xl font-black text-white">
                  42
                </span>
                <span className="block text-[10px] sm:text-xs text-[#e52222] uppercase tracking-widest">
                  PASSENGERS
                </span>
              </div>
              <div className="space-y-1 border-x border-[#e52222]/20">
                <span className="block text-3xl sm:text-5xl font-black text-white">
                  4
                </span>
                <span className="block text-[10px] sm:text-xs text-[#e52222] uppercase tracking-widest">
                  HOURS
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-3xl sm:text-5xl font-black text-white">
                  1
                </span>
                <span className="block text-[10px] sm:text-xs text-[#e52222] uppercase tracking-widest">
                  FINAL STOP
                </span>
              </div>
            </div>

            {/* Hook Quote */}
            <blockquote className="border-l-2 border-[#e52222] pl-6 py-2 text-xl sm:text-2xl text-[#f1f1ed] italic font-serif">
              &ldquo;{film.tagline}&rdquo;
            </blockquote>

            {/* One-Sentence Pitch */}
            {film.pitch && (
              <div className="space-y-3">
                <h3 className="font-mono text-xs tracking-widest uppercase text-[#e52222] font-bold">
                  ONE-SENTENCE PITCH
                </h3>
                <p className="text-base sm:text-lg text-[#d1d5db] leading-relaxed font-medium">
                  {film.pitch}
                </p>
              </div>
            )}

            {/* Logline */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs tracking-widest uppercase text-[#e52222] font-bold">
                LOGLINE
              </h3>
              <p className="text-base sm:text-lg text-[#d1d5db] leading-relaxed">
                {film.logline}
              </p>
            </div>

            <FilmStorySections
              sections={film.details?.sections}
              closingStatement={film.details?.closingStatement}
              accentColor={film.palette.accent}
            />

            {/* Creator Credit & Navigation */}
            <div className="pt-6 border-t border-[#e52222]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#898989]">
              <span>WRITTEN BY {film.creator.toUpperCase()}</span>
              <div className="flex items-center gap-6">
                <Link
                  href="/films/insane-aisylum"
                  className="text-[#898989] hover:text-white transition-colors"
                >
                  ← 01 INSANE AiSYLUM
                </Link>
                <Link
                  href="/films/life-is"
                  className="text-[#e52222] hover:text-white transition-colors"
                >
                  03 LIFE IS... →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
