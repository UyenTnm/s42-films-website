"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAPContext(
    () => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          ".hero-logo",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1.0, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
          "-=0.6"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          metaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );
    },
    heroRef,
    []
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex flex-col justify-between px-6 md:px-16 pt-8 pb-16 overflow-hidden"
    >
      {/* Background Radial Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-white/[0.03] via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Protocol Status */}
      <div className="hero-badge flex flex-wrap items-center justify-between font-mono text-[11px] text-[#898989] tracking-widest uppercase border-b border-[#f1f1ed]/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f1f1ed] animate-ping" />
          <span>S•42 FILMS</span>
        </div>
        <div>
          <span>42 GREAT STORIES WORTH REMEMBERING</span>
        </div>
      </div>

      {/* Main Center Area with Official S•42 Logo & Headline */}
      <div className="my-auto py-10 max-w-5xl space-y-8">
        {/* Official S•42 Metallic Logo Showcase */}
        <div className="hero-logo relative w-64 h-24 sm:w-80 sm:h-28 md:w-96 md:h-32">
          <Image
            src="/images/brand/s42-films-official.png"
            alt="S•42 FILMS"
            fill
            sizes="(max-width: 768px) 256px, 384px"
            className="object-contain object-left"
            priority
          />
        </div>

        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#f1f1ed] leading-[0.95] uppercase"
        >
          42 Great Stories <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f1f1ed] via-[#a3a39e] to-[#474744]">
            Worth Remembering.
          </span>
        </h1>

        <p className="hero-sub max-w-2xl text-base md:text-lg text-[#898989] leading-relaxed">
          Forty-two stories. Produced across cinema and episodic formats with distinct worlds and singular visions.
        </p>
      </div>

      {/* Bottom Information Bar */}
      <div
        ref={metaRef}
        className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-[#f1f1ed]/10 font-mono text-xs text-[#898989]"
      >
        <div className="flex items-center gap-8">
          <div>
            <span className="block text-[10px] text-[#555] tracking-widest uppercase">
              REVEALED SLOTS
            </span>
            <span className="text-[#f1f1ed] font-semibold text-sm">07 TITLES</span>
          </div>
          <div>
            <span className="block text-[10px] text-[#555] tracking-widest uppercase">
              INITIATIVE
            </span>
            <span className="text-[#f1f1ed] font-semibold text-sm">42 PRODUCTIONS</span>
          </div>
        </div>

        <Link
          href="#films"
          className="group inline-flex items-center gap-3 px-5 py-2.5 rounded border border-[#f1f1ed]/20 bg-[#f1f1ed]/5 hover:bg-[#f1f1ed] hover:text-[#050505] text-[#f1f1ed] transition-all duration-300"
        >
          <span className="text-xs uppercase tracking-widest">View 7 Film Projects</span>
          <span className="group-hover:translate-y-0.5 transition-transform duration-300">
            ↓
          </span>
        </Link>
      </div>
    </section>
  );
}
