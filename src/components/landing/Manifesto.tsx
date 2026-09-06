"use client";

import { useRef } from "react";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import gsap from "gsap";

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      gsap.fromTo(
        ".manifesto-line",
        { opacity: 0.1, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 1,
          },
        }
      );
    },
    sectionRef,
    []
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="py-24 md:py-36 px-6 md:px-16 border-t border-[#f1f1ed]/10 bg-[#070707] relative"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Label */}
        <div className="flex items-center gap-4 font-mono text-xs text-[#898989] tracking-widest uppercase">
          <span className="text-[#f1f1ed]">01 //</span>
          <span>THE S•42 MANIFESTO</span>
        </div>

        {/* Big Staggered Paragraph */}
        <div className="space-y-6 text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-snug md:leading-normal text-[#f1f1ed]">
          <p className="manifesto-line">
            We live in an era of infinite content, yet so little remains in memory.
          </p>
          <p className="manifesto-line text-[#898989]">
            S•42 was founded on a singular restriction: we will only produce forty-two films. Not forty-three. Not a franchise.
          </p>
          <p className="manifesto-line">
            Every story must justify its permanent place in cinema. Every visual must hold weight. Every sound must be deliberate.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#f1f1ed]/10 font-mono text-xs">
          <div className="space-y-2">
            <span className="text-[#f1f1ed] font-semibold text-sm">I. RADICAL FINITUDE</span>
            <p className="text-[#898989] leading-relaxed">
              By placing an absolute limit on our lifetime output, every greenlight carries life-or-death scrutiny.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-[#f1f1ed] font-semibold text-sm">II. SINGULAR WORLDS</span>
            <p className="text-[#898989] leading-relaxed">
              No shared universes. No prequels. Each production creates its own visual grammar, sonic identity, and tonal rules.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-[#f1f1ed] font-semibold text-sm">III. UNCOMPROMISING FORM</span>
            <p className="text-[#898989] leading-relaxed">
              Crafted for dark rooms, deep acoustic resonance, and visceral emotional longevity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
