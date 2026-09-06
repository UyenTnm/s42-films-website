"use client";

import Image from "next/image";
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
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-[#050505]/85 border-b border-[#f1f1ed]/10 transition-all duration-300">
      {/* Studio Brand with Official S•42 Logo */}
      <Link
        href="/"
        className="group flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <div className="relative w-28 h-9 md:w-32 md:h-10">
          <Image
            src="/images/brand/logo.png"
            alt="S•42 FILMS"
            fill
            sizes="128px"
            className="object-contain"
            priority
          />
        </div>
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

        {/* 42 Protocol Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded border border-[#f1f1ed]/15 bg-[#f1f1ed]/5 text-[10px] text-[#898989]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f1f1ed] animate-pulse" />
          <span>42 INITIATIVE</span>
        </div>
      </nav>
    </header>
  );
}
