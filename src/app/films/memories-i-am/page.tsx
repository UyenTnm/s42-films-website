import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFilmBySlug } from "@/data/films";

export const metadata: Metadata = {
  title: "06 — MEMORIES I AM | S•42 Films",
  description:
    "In a near future where memories can be bought and sold but never copied, a struggling father sells a treasured memory of love — and loses part of himself.",
};

export default function MemoriesIAmPage() {
  const film = getFilmBySlug("memories-i-am")!;

  return (
    <article
      data-theme="memories-i-am"
      className="min-h-screen bg-[#050810] text-[#dce8f5] relative overflow-hidden"
    >
      {/* Cool blue atmosphere */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-radial from-[#4a9eda]/[0.09] via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-24 space-y-16">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between border-b border-[#4a9eda]/20 pb-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#898989]">
            <Link href="/" className="hover:text-[#f1f1ed] transition-colors">
              S•42 FILMS
            </Link>
            <span>/</span>
            <span className="text-[#4a9eda] font-bold">FILM {film.number}</span>
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
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-[0_0_60px_rgba(74,158,218,0.15)] bg-black">
              <Image
                src={film.posterImage}
                alt="MEMORIES I AM Official Poster"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
                priority
              />
            </div>
            <p className="font-mono text-[10px] text-[#898989] tracking-widest text-center uppercase">
              ORIGINAL CONCEPT CREATED 2025 • © 2025 S.42 FILMS
            </p>
          </div>

          {/* Right Column: Story & Specification */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-10">
            {/* Header Titles */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#4a9eda]/10 font-mono text-xs text-[#4a9eda] tracking-widest uppercase font-semibold">
                FILM {film.number} {"//"}  S•42
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

            {/* Tagline Quote */}
            <blockquote className="border-l-2 border-[#4a9eda] pl-6 py-2 text-xl sm:text-2xl text-[#f1f1ed] italic font-serif">
              &ldquo;{film.tagline}&rdquo;
            </blockquote>

            {/* Production Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-lg border border-[#4a9eda]/20 bg-[#090d18] font-mono text-xs">
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">FORMAT</span>
                <span className="text-[#f1f1ed] font-semibold text-sm">{film.format}</span>
              </div>
              <div>
                <span className="text-[#898989] block mb-1 text-[11px] uppercase tracking-wider">GENRE</span>
                <span className="text-[#f1f1ed] font-semibold text-sm">{film.genre}</span>
              </div>
            </div>

            {/* Logline */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs tracking-widest uppercase text-[#4a9eda] font-bold">LOGLINE</h3>
              <p className="text-base sm:text-lg text-[#d1d5db] leading-relaxed">{film.logline}</p>
            </div>

            {/* The World */}
            <div className="p-5 rounded-lg border border-[#4a9eda]/20 bg-[#090d18] space-y-4">
              <h3 className="font-mono text-xs tracking-widest uppercase text-[#4a9eda] font-bold">THE WORLD</h3>
              <p className="text-sm text-[#b5c8dc] leading-relaxed">
                In the near future, human memory has become the world&apos;s most valuable commodity. A memory can be
                transferred from one person to another, but it cannot be copied: once sold, it disappears completely
                from the person who lived it and becomes an authentic part of the person who buys it.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                {[
                  { label: "ONE OWNER", sublabel: "No Copies" },
                  { label: "MEMORY TRANSFER", sublabel: "Authentic Experience" },
                  { label: "IDENTITY", sublabel: "At Stake" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded border border-[#4a9eda]/15 bg-[#0a1020] text-center space-y-1">
                    <div className="text-[#4a9eda] font-bold text-[11px] tracking-wider uppercase">{item.label}</div>
                    <div className="text-[#6a7f95] text-[10px]">{item.sublabel}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#7a909f] leading-relaxed border-t border-[#4a9eda]/10 pt-3">
                If someone else possesses your memories, how much of you now exists in them? And if you sell enough of
                your past, when do you stop being the person who lived it?
              </p>
            </div>

            {/* Creator Credit */}
            <div className="pt-6 border-t border-[#4a9eda]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#898989]">
              <span>A NEW ORIGINAL STORY BY {film.creator.toUpperCase()}</span>
              <div className="flex items-center gap-6">
                <Link href="/films/the-sum-of-me" className="text-[#898989] hover:text-white transition-colors">
                  ← 05 THE SUM OF ME
                </Link>
                <Link href="/films/everyone-thinks-im-dead" className="text-[#4a9eda] hover:text-white transition-colors">
                  07 EVERYONE THINKS I&apos;M DEAD →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
