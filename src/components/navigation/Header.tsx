"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLenis } from "@/hooks/useLenis";

export default function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [instant, setInstant] = useState(false);
  const prevPathname = useRef(pathname);

  // Watch native scroll to toggle the scrolled state
  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * 0.18);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Khi đổi route: nhảy về đúng trạng thái NGAY LẬP TỨC, không cho transition chạy lóe lên
  useLayoutEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setInstant(true);
      setScrolled(window.scrollY > window.innerHeight * 0.18);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setInstant(false));
      });
    }
  }, [pathname]);

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
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 ease-out ${
        instant ? "transition-none" : "transition-all duration-700"
      } ${
        scrolled
          ? "bg-[#050505]/88 backdrop-blur-lg border-b border-[#f1f1ed]/[0.07]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className={`${instant ? "transition-none" : "transition-all duration-500"} ${
          scrolled
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
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

      {/* Nav */}
      <nav
        className={`flex items-center gap-5 md:gap-9 font-heading font-ethnocentric text-[10px] sm:text-[11px] uppercase tracking-wider ${
          instant ? "transition-none" : "transition-all duration-500"
        } ${scrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {pathname === "/" ? (
          <>
            <button
              onClick={() => scrollTo("#films")}
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200 cursor-pointer"
            >
              Films [07]
            </button>
            <button
              onClick={() => scrollTo("#manifesto")}
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200 cursor-pointer"
            >
              Promise
            </button>
          </>
        ) : (
          <>
            <Link
              href="/#films"
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200"
            >
              Films Index
            </Link>
            <Link
              href="/"
              className="text-[#898989] hover:text-[#f1f1ed] transition-colors duration-200"
            >
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
