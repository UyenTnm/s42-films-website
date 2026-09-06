"use client";

import Image from "next/image";
import Link from "next/link";
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
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Footer Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#f1f1ed]/10 font-mono text-xs">
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
            <p className="text-[#666]">
              42 great stories worth remembering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 md:gap-8 uppercase tracking-widest text-[11px]">
            <Link
              href="/films/insane-aisylum"
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors"
            >
              01 INSANE AiSYLUM
            </Link>
            <Link
              href="/films/suicide-train"
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors"
            >
              02 SUICIDE TRAIN
            </Link>
            <Link
              href="/films/life-is"
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors"
            >
              03 LIFE IS...
            </Link>
            <button
              onClick={scrollToTop}
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors cursor-pointer ml-auto"
            >
              Back To Top ↑
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[10px] text-[#555]">
          <span>© S•42 FILMS. ALL RIGHTS RESERVED.</span>
          <span>WRITTEN AND CREATED BY WESLEY ANTON DADWAH</span>
        </div>
      </div>
    </footer>
  );
}
