import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";

export const metadata: Metadata = {
  title: "05 — THE SUM OF ME | S•42 Films",
  description:
    "In his forty-second and final life, a man begins remembering every person his soul has ever been — and discovers that humanity is not judged by a single lifetime, but by the sum of all 42.",
};

export default function TheSumOfMePage() {
  const film = getFilmBySlug("the-sum-of-me")!;

  return (
    <article
      data-theme="the-sum-of-me"
      className="min-h-screen bg-[#080706] text-[#ece4d5] relative overflow-hidden"
    >
      {/* Warm golden atmosphere */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-radial from-[#c9a84c]/[0.09] via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-24 space-y-16">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between border-b border-[#c9a84c]/20 pb-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#898989]">
            <Link href="/" className="hover:text-[#f1f1ed] transition-colors">
              S•42 FILMS
            </Link>
            <span>/</span>
            <span className="text-[#c9a84c] font-bold">FILM {film.number}</span>
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
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden border border-[#c9a84c]/30 shadow-[0_0_60px_rgba(201,168,76,0.15)] bg-black">
              <Image
                src={film.posterImage}
                alt="THE SUM OF ME Official Poster"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#c9a84c]/10 border border-[#c9a84c]/30 font-mono text-xs text-[#c9a84c] tracking-widest uppercase font-semibold">
                FILM {film.number} {"//"}  S•42
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-none">
                THE SUM<br />
                <span className="text-[#c9a84c]">OF ME</span>
              </h1>

              <h2 className="font-mono text-sm sm:text-base text-[#a3a3a3] tracking-widest uppercase font-medium">
                {film.subtitle}
              </h2>
            </div>

            {/* Tagline Quote */}
            <blockquote className="border-l-2 border-[#c9a84c] pl-6 py-2 text-xl sm:text-2xl text-[#f1f1ed] italic font-serif">
              &ldquo;{film.tagline}&rdquo;
            </blockquote>

            {/* Stats */}
            {film.details?.stats && (
              <div className="grid grid-cols-3 gap-4 p-6 rounded-lg border border-[#c9a84c]/20 bg-[#0f0d09] font-mono">
                {film.details.stats.map((stat) => (
                  <div key={stat.label} className="text-center space-y-1">
                    <div className="text-3xl sm:text-4xl font-black text-[#c9a84c]">
                      {stat.value}
                    </div>
                    <div className="text-[10px] tracking-widest uppercase text-[#898989]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* One-sentence pitch */}
            {film.pitch && (
              <div className="space-y-3">
                <h3 className="font-mono text-xs tracking-widest uppercase text-[#c9a84c] font-bold">
                  ONE-SENTENCE PITCH
                </h3>
                <p className="text-base sm:text-lg text-[#d1d5db] leading-relaxed font-medium">
                  {film.pitch}
                </p>
              </div>
            )}

            {/* Logline */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs tracking-widest uppercase text-[#c9a84c] font-bold">
                LOGLINE
              </h3>
              <p className="text-base text-[#b8b0a5] leading-relaxed">
                {film.logline}
              </p>
            </div>

            {/* Audience Promise */}
            {film.details?.audiencePromise && (
              <div className="p-5 rounded-lg border border-[#c9a84c]/20 bg-[#0f0d09] space-y-3">
                <h3 className="font-mono text-xs tracking-widest uppercase text-[#c9a84c] font-bold">
                  THE AUDIENCE PROMISE
                </h3>
                <p className="text-sm text-[#b5aba7] leading-relaxed">
                  {film.details.audiencePromise}
                </p>
              </div>
            )}

            {/* Emotional Engine */}
            {film.details?.emotionalEngine && (
              <div className="p-5 rounded-lg border border-[#c9a84c]/15 bg-[#0d0b08] space-y-3">
                <h3 className="font-mono text-xs tracking-widest uppercase text-[#c9a84c] font-bold">
                  THE EMOTIONAL ENGINE
                </h3>
                <p className="text-sm text-[#9c9285] leading-relaxed">
                  {film.details.emotionalEngine}
                </p>
              </div>
            )}

            {/* Creator Credit */}
            <div className="pt-6 border-t border-[#c9a84c]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#898989]">
              <span>WRITTEN BY {film.creator.toUpperCase()}</span>
              <div className="flex items-center gap-6">
                <Link
                  href="/films/l-42-06"
                  className="text-[#898989] hover:text-white transition-colors"
                >
                  ← 04 L.42.06
                </Link>
                <Link
                  href="/films/memories-i-am"
                  className="text-[#c9a84c] hover:text-white transition-colors"
                >
                  06 MEMORIES I AM →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
