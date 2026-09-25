import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";

export const metadata: Metadata = {
  title: "03 — LIFE IS... | S•42 Films",
  description:
    "A four-feature-film streaming event built around one promise: watch the same family story as a Comedy, a Romance, a Mystery, or a Drama.",
};

export default function LifeIsPage() {
  const film = getFilmBySlug("life-is")!;

  return (
    <article
      data-theme="life-is"
      className="min-h-screen bg-[#090807] text-[#ebe4dc] relative overflow-hidden"
    >
      {/* Warm Sunset Amber Atmosphere matching poster */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-radial from-[#f5a623]/[0.08] via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-24 space-y-16">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between border-b border-[#f5a623]/20 pb-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#898989]">
            <Link href="/" className="hover:text-[#f1f1ed] transition-colors">
              S•42 FILMS
            </Link>
            <span>/</span>
            <span className="text-[#f5a623] font-bold">FILM {film.number}</span>
          </div>
          <Link
            href="/#films"
            className="relative z-[60] pointer-events-auto cursor-pointer text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200 uppercase tracking-widest"
          >
            ← All Films
          </Link>
        </div>

        {/* Main Content Layout: Poster + Narrative Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Official Poster */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-[0_0_40px_rgba(245,166,35,0.15)] bg-black">
              <Image
                src={film.posterImage}
                alt="LIFE IS... Official Poster"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
                priority
              />
            </div>
            <p className="font-mono text-[10px] text-[#898989] tracking-widest text-center uppercase">
              CONFIDENTIAL — PRIVATE DEVELOPMENT MATERIAL • 42 CROSSROADS
              CRESCENT
            </p>
          </div>

          {/* Right Column: Narrative Structure */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-10">
            {/* Header Titles */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#f5a623]/10 font-mono text-xs text-[#f5a623] tracking-widest uppercase font-semibold">
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

            {/* Core Hook Quote */}
            <blockquote className="border-l-2 border-[#f5a623] pl-6 py-2 text-xl sm:text-2xl text-[#f1f1ed] italic font-serif">
              &ldquo;SAME FAMILY. SAME ACTORS. SAME HOUSE. SAME FAMILIAR
              SETTINGS. <br />
              <span className="text-[#f5a623] font-sans font-bold not-italic text-lg sm:text-xl">
                SAME WEEKEND. DIFFERENT MOVIE.
              </span>
              &rdquo;
            </blockquote>

            {/* The Proposition */}
            <div className="space-y-3 p-6 rounded-lg border border-[#f5a623]/20 bg-[#120f0c]">
              <h3 className="font-mono text-xs tracking-widest uppercase text-[#f5a623] font-bold">
                THE PROPOSITION
              </h3>
              <p className="text-base text-[#f1f1ed] font-medium leading-relaxed">
                {film.pitch}
              </p>
              <p className="text-sm text-[#b8b0a5] leading-relaxed pt-2">
                {film.logline}
              </p>
              {film.details?.proposition && (
                <p className="text-sm text-[#8c857b] leading-relaxed pt-2 border-t border-[#f5a623]/10">
                  {film.details.proposition}
                </p>
              )}
            </div>

            {/* The Four Films Quadrants */}
            {film.details?.fourFilms && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#f5a623]/20 pb-2">
                  <h3 className="font-mono text-xs tracking-widest uppercase text-[#f5a623] font-bold">
                    4 GENRES. ONE FAMILY. MULTIPLE TRUTHS.
                  </h3>
                  <span className="font-mono text-[11px] text-[#898989]">
                    24 POSSIBLE VIEWING ORDERS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  {film.details.fourFilms.map((subFilm) => (
                    <div
                      key={subFilm.title}
                      className="p-5 rounded-lg border bg-[#0d0b09] space-y-2"
                      style={{ borderColor: `${subFilm.color}40` }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-bold text-xs uppercase tracking-wider"
                          style={{ color: subFilm.color }}
                        >
                          {subFilm.title}
                        </span>
                        <span className="italic font-serif text-[#f1f1ed] text-sm">
                          {subFilm.tagline}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#a8a197] leading-relaxed font-sans">
                        {subFilm.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Central Invitation Banner */}
            <div className="p-4 rounded bg-[#f5a623]/5 text-center font-mono text-xs space-y-1">
              <span className="text-[#f5a623] font-bold uppercase tracking-widest block">
                CHOOSE YOUR GENRE. START ANYWHERE. WATCH THEM ALL.
              </span>
              <span className="text-[#898989] text-[11px]">
                WE LAUGH. WE FALL IN LOVE. WE SEARCH FOR ANSWERS. WE ENDURE.
              </span>
            </div>

            {/* Creator Credit & Navigation */}
            <div className="pt-6 border-t border-[#f5a623]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#898989]">
              <span>A NEW ORIGINAL STORY BY {film.creator.toUpperCase()}</span>
              <div className="flex items-center gap-6">
                <Link
                  href="/films/suicide-train"
                  className="text-[#898989] hover:text-white transition-colors"
                >
                  ← 02 SUICIDE TRAIN
                </Link>
                <Link
                  href="/films/l-42-06"
                  className="text-[#f5a623] hover:text-white transition-colors"
                >
                  04 L.42.06 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
