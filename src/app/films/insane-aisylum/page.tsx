import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";

export const metadata: Metadata = {
  title: "01 — INSANE AiSYLUM | S•42 Films",
  description:
    "In 2042, the first artificial being accused of murder is declared legally insane and committed to a maximum-security psychiatric institution on a remote island off the coast of Tokyo.",
};

export default function InsaneAisylumPage() {
  const film = getFilmBySlug("insane-aisylum")!;

  return (
    <article
      data-theme="insane-aisylum"
      className="min-h-screen bg-[#060709] text-[#e1e5eb] relative overflow-hidden"
    >
      {/* Subtle Red Atmosphere matching poster */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-radial from-[#e50914]/[0.08] via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-24 space-y-16">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between border-b border-[#e50914]/20 pb-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#898989]">
            <Link href="/" className="hover:text-[#f1f1ed] transition-colors">
              S•42 FILMS
            </Link>
            <span>/</span>
            <span className="text-[#e50914] font-bold">FILM {film.number}</span>
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
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-[0_0_40px_rgba(229,9,20,0.15)] bg-black">
              <Image
                src={film.posterImage}
                alt="INSANE AiSYLUM Official Poster"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e50914]/10 font-mono text-xs text-[#e50914] tracking-widest uppercase font-semibold">
                FILM {film.number} {"//"} S•42
              </div>

              {/* Official Film Title Graphic */}
              <div className="relative h-20 sm:h-28 md:h-36 lg:h-40 w-full max-w-[550px] sm:max-w-[750px] md:max-w-[900px]">
                <Image
                  src={film.titleImage}
                  alt={film.title}
                  fill
                  sizes="(max-width: 640px) 550px, 900px"
                  className="object-contain object-left [filter:drop-shadow(0_0_20px_rgba(255,255,255,0.55))_drop-shadow(0_4px_16px_rgba(0,0,0,0.98))]"
                  priority
                />
              </div>

              <h2 className="font-mono text-sm sm:text-base text-[#a3a3a3] tracking-widest uppercase font-medium">
                {film.subtitle}
              </h2>
            </div>

            {/* Tagline Quote */}
            <blockquote className="border-l-2 border-[#e50914] pl-6 py-2 text-xl sm:text-2xl text-[#f1f1ed] italic font-serif">
              &ldquo;{film.tagline}&rdquo;
            </blockquote>

            {/* Production Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-lg border border-[#e50914]/20 bg-[#0c0d10] font-mono text-xs">
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">
                  FORMAT
                </span>
                <span className="text-[#f1f1ed] font-semibold text-sm">
                  {film.format}
                </span>
              </div>
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">
                  SETTING
                </span>
                <span className="text-[#f1f1ed] font-semibold text-sm">
                  {film.setting}
                </span>
              </div>
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">
                  GENRE
                </span>
                <span className="text-[#f1f1ed] font-semibold text-sm">
                  {film.genre}
                </span>
              </div>
            </div>

            {/* Logline */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs tracking-widest uppercase text-[#e50914] font-bold">
                LOGLINE
              </h3>
              <p className="text-base sm:text-lg text-[#d1d5db] leading-relaxed">
                {film.logline}
              </p>
            </div>

            {/* Creator Credit */}
            <div className="pt-6 border-t border-[#e50914]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#898989]">
              <span>WRITTEN AND CREATED BY {film.creator.toUpperCase()}</span>
              <Link
                href="/films/suicide-train"
                className="inline-flex items-center gap-2 text-[#e50914] hover:text-white transition-colors"
              >
                <span>Next: 02 SUICIDE TRAIN</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
