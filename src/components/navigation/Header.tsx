"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/hooks/useLenis";

export default function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Watch native scroll to toggle the scrolled state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.18);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (pathname !== "/") return;
    if (lenis) {
      lenis.scrollTo(id, { offset: -60 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 transition-all duration-700 ease-out ${
        scrolled
          ? "bg-[#050505]/88 backdrop-blur-lg border-b border-[#f1f1ed]/[0.07]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Logo — hidden until scrolled past hero */}
      <Link
        href="/"
        className={`transition-all duration-500 ${scrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-label="S•42 Films — Home"
      >
        <div className="relative w-28 h-10 md:w-36 md:h-12 flex items-center justify-center">
          <Image
            src="/images/brand/s42-films-official.png"
            alt="S•42 FILMS"
            fill
            sizes="160px"
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </Link>

      {/* Nav — hidden until scrolled past hero */}
      <nav
        className={`flex items-center gap-5 md:gap-9 font-mono text-[11px] uppercase tracking-widest transition-all duration-500 ${
          scrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {pathname === "/" ? (
          <>
            <button
              onClick={() => scrollTo("#films")}
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200 cursor-pointer"
            >
              Films [03]
            </button>
            <button
              onClick={() => scrollTo("#manifesto")}
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200 cursor-pointer"
            >
              Manifesto
            </button>
          </>
        ) : (
          <>
            <Link href="/#films" className="text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200">
              Films Index
            </Link>
            <Link href="/" className="text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200">
              S•42 Home
            </Link>
          </>
        )}

        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded border border-[#f1f1ed]/[0.13] bg-[#f1f1ed]/[0.04] text-[10px] text-[#636360]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f1f1ed]/50 animate-pulse" />
          <span>42 INITIATIVE</span>
        </div>
      </nav>
    </header>
  );
}
