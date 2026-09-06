"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "@/hooks/useLenis";

export default function Header() {
  const pathname = usePathname();
  const lenis = useLenis();

  const handleScrollTo = (id: string) => {
    if (pathname === "/") {
      if (lenis) {
        lenis.scrollTo(id, { offset: -60 });
      } else {
        const el = document.querySelector(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 backdrop-blur-md bg-[#050505]/80 border-b border-[#f1f1ed]/10 transition-all duration-300">
      {/* Studio Brand */}
      <Link
        href="/"
        className="group flex items-center gap-2 font-mono text-sm tracking-widest text-[#f1f1ed] hover:opacity-80 transition-opacity"
      >
        <span className="font-bold tracking-tighter text-base">S</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f1f1ed] group-hover:scale-125 group-hover:bg-[#00f0ff] transition-all duration-300 animate-pulse" />
        <span className="font-bold tracking-tighter text-base">42</span>
        <span className="hidden sm:inline-block ml-3 pl-3 border-l border-[#f1f1ed]/20 text-[11px] text-[#898989] tracking-widest uppercase">
          Films
        </span>
      </Link>

      {/* Nav Actions */}
      <nav className="flex items-center gap-6 md:gap-10 font-mono text-xs uppercase tracking-widest">
        {pathname === "/" ? (
          <>
            <button
              onClick={() => handleScrollTo("#films")}
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors cursor-pointer"
            >
              Films [03]
            </button>
            <button
              onClick={() => handleScrollTo("#manifesto")}
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors cursor-pointer"
            >
              Manifesto
            </button>
          </>
        ) : (
          <>
            <Link
              href="/#films"
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors"
            >
              Films Index
            </Link>
            <Link
              href="/"
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors"
            >
              Return S•42
            </Link>
          </>
        )}

        {/* Transmission Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded border border-[#f1f1ed]/15 bg-[#f1f1ed]/5 text-[10px] text-[#898989]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>SYS ON AIR</span>
        </div>
      </nav>
    </header>
  );
}
