import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";
import FilmStorySections from "@/components/films/FilmStorySections";

export const metadata: Metadata = {
  title: "07 — EVERYONE THINKS I'M DEAD | S•42 Films",
  description:
    "A burned-out American businessman mistakenly declared dead after a car crash in Mexico decides to remain dead and discovers what everyone really thinks of him.",
};

export default function EveryoneThinkImDeadPage() {
  const film = getFilmBySlug("everyone-thinks-im-dead")!;

  return (
    <article
      data-theme="everyone-thinks-im-dead"
      className="min-h-screen bg-[#080807] text-[#ede9e0] relative overflow-hidden"
    >
      {/* Warm amber atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-radial from-[#e8c44a]/[0.08] via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-24 space-y-16">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between border-b border-[#e8c44a]/20 pb-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#898989]">
            <Link href="/" className="hover:text-[#f1f1ed] transition-colors">
              S•42 FILMS
            </Link>
            <span>/</span>
            <span className="text-[#e8c44a] font-bold">FILM {film.number}</span>
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
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-[0_0_60px_rgba(232,196,74,0.14)] bg-black">
              <Image
                src={film.posterImage}
                alt="EVERYONE THINKS I'M DEAD Official Poster"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
                priority
              />
            </div>
            <p className="font-mono text-[10px] text-[#898989] tracking-widest text-center uppercase">
              COMING SOON • © S•42 FILMS
            </p>
          </div>

          {/* Right Column: Story & Specification */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-10">
            {/* Header Titles */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e8c44a]/10 font-mono text-xs text-[#e8c44a] tracking-widest uppercase font-semibold">
                FILM {film.number} {"//"}  S•42
              </div>

              {/* Official Film Title Graphic */}
              <div className="relative h-22 sm:h-32 md:h-40 lg:h-48 w-full max-w-[620px] sm:max-w-[820px] md:max-w-[980px]">
                <Image
                  src={film.titleImage}
                  alt={film.title}
                  fill
                  sizes="(max-width: 640px) 550px, 980px"
                  className="object-contain object-left [filter:drop-shadow(0_0_12px_rgba(255,255,255,0.4))_drop-shadow(0_3px_10px_rgba(0,0,0,0.95))]"
                  priority
                />
              </div>

              <h2 className="font-mono text-sm sm:text-base text-[#a3a3a3] tracking-widest uppercase font-medium">
                {film.subtitle}
              </h2>
            </div>

            {/* Tagline Quote */}
            <blockquote className="border-l-2 border-[#e8c44a] pl-6 py-2 text-xl sm:text-2xl text-[#f1f1ed] italic font-serif">
              &ldquo;{film.tagline}&rdquo;
            </blockquote>

            {/* The Choice Banner */}
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-5 rounded-lg border border-[#e8c44a]/25 bg-[#0f0e09] text-center space-y-2">
                <div className="text-2xl font-black text-[#e8c44a]">STAY DEAD?</div>
                <div className="text-[#7a7060] text-[11px] leading-relaxed">Debts frozen. Job gone.<br />Complete freedom.</div>
              </div>
              <div className="p-5 rounded-lg border border-[#f1f1ed]/15 bg-[#0f0e09] text-center space-y-2">
                <div className="text-2xl font-black text-[#f1f1ed]">COME BACK?</div>
                <div className="text-[#7a7060] text-[11px] leading-relaxed">Return as someone<br />worth returning as.</div>
              </div>
            </div>

            {/* Production Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-lg border border-[#e8c44a]/20 bg-[#0f0e09] font-mono text-xs">
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

            {/* One-Sentence Pitch */}
            {film.pitch && (
              <div className="space-y-3">
                <h3 className="font-mono text-xs tracking-widest uppercase text-[#e8c44a] font-bold">
                  ONE-SENTENCE PITCH
                </h3>
                <p className="text-base sm:text-lg text-[#d1d5db] leading-relaxed font-medium">
                  {film.pitch}
                </p>
              </div>
            )}

            {/* Logline */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs tracking-widest uppercase text-[#e8c44a] font-bold">LOGLINE</h3>
              <p className="text-base sm:text-lg text-[#d1d5db] leading-relaxed">{film.logline}</p>
            </div>

            <FilmStorySections
              sections={film.details?.sections}
              closingStatement={film.details?.closingStatement}
              accentColor={film.palette.accent}
            />

            {/* Creator Credit */}
            <div className="pt-6 border-t border-[#e8c44a]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#898989]">
              <span>A NEW ORIGINAL STORY BY {film.creator.toUpperCase()}</span>
              <div className="flex items-center gap-6">
                <Link href="/films/memories-i-am" className="text-[#898989] hover:text-white transition-colors">
                  ← 06 MEMORIES I AM
                </Link>
                <Link href="/#films" className="text-[#e8c44a] hover:text-white transition-colors">
                  Return to S•42 ↑
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
