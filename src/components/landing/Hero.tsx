"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAPContext(
    () => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" },
          "-=0.5"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
          "-=0.7"
        )
        .fromTo(
          metaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.0, ease: "power2.out" },
          "-=0.5"
        );
    },
    heroRef,
    []
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex flex-col justify-between px-6 md:px-16 pt-12 pb-16 overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-white/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Telemetry */}
      <div className="hero-badge flex flex-wrap items-center justify-between font-mono text-[11px] text-[#898989] tracking-widest uppercase border-b border-[#f1f1ed]/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f1f1ed] animate-ping" />
          <span>STUDIO BROADCAST // 42° N 71° W</span>
        </div>
        <div>
          <span>INITIATIVE // 42 CANONICAL FILMS</span>
        </div>
      </div>

      {/* Center Cinematic Statement */}
      <div className="my-auto py-12 max-w-6xl space-y-6">
        <h1
          ref={headlineRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#f1f1ed] leading-[0.92] uppercase"
        >
          42 Great <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f1f1ed] via-[#898989] to-[#3a3a3a]">
            Stories
          </span>{" "}
          <br />
          Worth Remembering.
        </h1>

        <p className="hero-sub max-w-xl text-base md:text-xl text-[#898989] font-light leading-relaxed">
          An unhurried cinematic studio constructing forty-two uncompromising feature
          narratives. Each film is its own world, free from algorithmic compromise.
        </p>
      </div>

      {/* Bottom Coordinates & Scroll Trigger */}
      <div
        ref={metaRef}
        className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-[#f1f1ed]/10 font-mono text-xs text-[#898989]"
      >
        <div className="flex items-center gap-8">
          <div>
            <span className="block text-[10px] text-[#555] tracking-widest uppercase">
              ACTIVE ROSTER
            </span>
            <span className="text-[#f1f1ed] font-semibold text-sm">03 FILMS</span>
          </div>
          <div>
            <span className="block text-[10px] text-[#555] tracking-widest uppercase">
              REMAINING
            </span>
            <span className="text-[#f1f1ed] font-semibold text-sm">39 TO PRODUCE</span>
          </div>
        </div>

        <Link
          href="#films"
          className="group inline-flex items-center gap-3 px-5 py-2.5 rounded border border-[#f1f1ed]/20 bg-[#f1f1ed]/5 hover:bg-[#f1f1ed] hover:text-[#050505] text-[#f1f1ed] transition-all duration-300"
        >
          <span className="text-xs uppercase tracking-widest">Explore Roster</span>
          <span className="group-hover:translate-y-0.5 transition-transform duration-300">
            ↓
          </span>
        </Link>
      </div>
    </section>
  );
}
