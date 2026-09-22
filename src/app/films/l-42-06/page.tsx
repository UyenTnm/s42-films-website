import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";

export const metadata: Metadata = {
  title: "04 — L.42.06 | S•42 Films",
  description:
    "After moving into apartment L.42.06, a new tenant discovers a door that appears where no door should exist — and becomes an invisible witness to violence he cannot stop.",
};

export default function L4206Page() {
  const film = getFilmBySlug("l-42-06")!;

  return (
    <article
      data-theme="l-42-06"
      className="min-h-screen bg-[#070505] text-[#e5dcd8] relative overflow-hidden"
    >
      {/* Deep crimson atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-radial from-[#c0392b]/[0.10] via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial from-[#c0392b]/[0.06] via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-24 space-y-16">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between border-b border-[#c0392b]/20 pb-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#898989]">
            <Link href="/" className="hover:text-[#f1f1ed] transition-colors">
              S•42 FILMS
            </Link>
            <span>/</span>
            <span className="text-[#c0392b] font-bold">FILM {film.number}</span>
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
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-[0_0_60px_rgba(192,57,43,0.18)] bg-black">
              <Image
                src={film.posterImage}
                alt="L.42.06 Official Poster"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
                priority
              />
            </div>
            <p className="font-mono text-[10px] text-[#898989] tracking-widest text-center uppercase">
              CONFIDENTIAL • DO NOT DISTRIBUTE
            </p>
          </div>

          {/* Right Column: Story & Specification */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-10">
            {/* Header Titles */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#c0392b]/10 font-heading font-ethnocentric text-xs text-[#c0392b] tracking-wider uppercase font-semibold">
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

              <h2 className="font-sans text-xs sm:text-sm text-[#a3a3a3] tracking-widest uppercase font-medium">
                {film.subtitle}
              </h2>
            </div>

            {/* Tagline Quote */}
            <blockquote className="border-l-2 border-[#c0392b] pl-6 py-2 text-xl sm:text-2xl text-[#f1f1ed] italic font-light font-sans">
              &ldquo;{film.tagline}&rdquo;
            </blockquote>

            {/* Production Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-lg border border-[#c0392b]/20 bg-[#0d0909] font-sans text-xs">
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">
                  FORMAT
                </span>
                <span className="text-[#f1f1ed] font-medium text-sm">
                  {film.format}
                </span>
              </div>
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">
                  GENRE
                </span>
                <span className="text-[#f1f1ed] font-medium text-sm">
                  {film.genre}
                </span>
              </div>
            </div>

            {/* Logline */}
            <div className="space-y-3">
              <h3 className="font-heading font-ethnocentric text-xs tracking-wider uppercase text-[#c0392b] font-bold">
                LOGLINE
              </h3>
              <p className="font-sans text-base sm:text-lg text-[#d1d5db] leading-relaxed font-light">
                {film.logline}
              </p>
            </div>

            {/* The Hook — key thematic statement */}
            <div className="p-5 rounded-lg border border-[#c0392b]/25 bg-[#110808] space-y-3">
              <h3 className="font-mono text-xs tracking-widest uppercase text-[#c0392b] font-bold">
                THE PREMISE
              </h3>
              <p className="text-sm text-[#b5aba7] leading-relaxed">
                A door that should not exist. Violence witnessed through it. No
                way to intervene. No way to prove it. And the door keeps coming
                back — revealing more each time.
              </p>
              <p className="text-sm text-[#7a706c] leading-relaxed border-t border-[#c0392b]/10 pt-3">
                The true mystery of L.42.06 is not what lies behind the door.
                It is why this man — and only this man — is being shown.
              </p>
            </div>

            {/* Creator Credit */}
            <div className="pt-6 border-t border-[#c0392b]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#898989]">
              <span>A NEW ORIGINAL STORY BY {film.creator.toUpperCase()}</span>
              <div className="flex items-center gap-6">
                <Link
                  href="/films/life-is"
                  className="text-[#898989] hover:text-white transition-colors"
                >
                  ← 03 LIFE IS...
                </Link>
                <Link
                  href="/films/the-sum-of-me"
                  className="text-[#c0392b] hover:text-white transition-colors"
                >
                  05 THE SUM OF ME →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
