"use client";

import {
  faFacebookF,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { films } from "@/data/films";
import { useLenis } from "@/hooks/useLenis";

export default function Footer() {
  const lenis = useLenis();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#050505] text-[#898989] border-t border-[#f1f1ed]/10 px-6 md:px-16 pt-16 pb-12 overflow-hidden">
      <div className="w-full space-y-12">
        {/* Top Footer Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/[0.08] font-sans text-xs">
          <div className="space-y-2">
            <div className="relative w-28 h-10 flex items-center justify-start">
              <Image
                src="/images/brand/s42-films-official.png"
                alt="S•42 FILMS"
                fill
                sizes="120px"
                className="object-contain object-left"
                unoptimized
              />
            </div>
            <p className="text-[#666] font-light">
              42 great stories worth remembering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:gap-x-8 font-heading font-ethnocentric text-[9px] sm:text-[10px] tracking-wider uppercase">
            {films.map((film) => (
              <Link
                key={film.slug}
                href={`/films/${film.slug}`}
                className="text-[#898989] hover:text-white transition-colors"
              >
                {film.number} {film.title}
              </Link>
            ))}
            <button
              onClick={scrollToTop}
              className="text-[#898989] hover:text-white transition-colors cursor-pointer ml-auto"
            >
              Back To Top ↑
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col items-start justify-between gap-6 font-sans text-xs text-[#555] font-light sm:flex-row sm:items-center">
          <span>© S•42 FILMS. ALL RIGHTS RESERVED.</span>
          <nav aria-label="S•42 Films social media" className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/s42films/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="S•42 Films on Facebook"
              title="Facebook"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-[#898989] transition-colors hover:border-white/30 hover:text-white"
            >
              <FontAwesomeIcon icon={faFacebookF} className="size-4" />
            </a>
            <a
              href="https://www.instagram.com/s42films/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="S•42 Films on Instagram"
              title="Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-[#898989] transition-colors hover:border-white/30 hover:text-white"
            >
              <FontAwesomeIcon icon={faInstagram} className="size-4" />
            </a>
            <a
              href="https://www.youtube.com/@S42FILMSAdmin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="S•42 Films on YouTube"
              title="YouTube"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-[#898989] transition-colors hover:border-white/30 hover:text-white"
            >
              <FontAwesomeIcon icon={faYoutube} className="size-4" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
