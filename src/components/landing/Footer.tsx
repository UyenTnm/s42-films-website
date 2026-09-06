"use client";

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
    <footer className="relative bg-[#050505] text-[#898989] border-t border-[#f1f1ed]/10 px-6 md:px-16 pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Footer Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[#f1f1ed]/10 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[#f1f1ed] font-bold tracking-widest text-sm">
              S•42 FILMS STUDIO
            </span>
            <p className="text-[#666]">
              42 Great Stories Worth Remembering. All Rights Reserved.
            </p>
          </div>

          <div className="flex items-center gap-8 uppercase tracking-widest">
            <button
              onClick={scrollToTop}
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors cursor-pointer"
            >
              Back To Top ↑
            </button>
            <Link
              href="/#films"
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors"
            >
              Films Roster
            </Link>
          </div>
        </div>

        {/* Large Watermark */}
        <div className="flex items-baseline justify-between select-none">
          <span className="text-6xl sm:text-9xl font-black font-mono tracking-tighter text-[#f1f1ed]/5">
            S•42
          </span>
          <span className="font-mono text-[10px] text-[#444] tracking-widest uppercase">
            CANONICAL EDITION // VOL. 1
          </span>
        </div>
      </div>
    </footer>
  );
}
