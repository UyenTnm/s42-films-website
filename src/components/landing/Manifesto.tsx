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
        { opacity: 0.15, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 65%",
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
      className="py-20 md:py-32 px-6 md:px-16 border-t border-[#f1f1ed]/10 bg-[#070707] relative"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 font-mono text-xs text-[#898989] tracking-widest uppercase">
          <span className="text-[#f1f1ed]">01 //</span>
          <span>THE S•42 PROMISE</span>
        </div>

        {/* Core Statement */}
        <div className="space-y-4 text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-tight text-[#f1f1ed]">
          <p className="manifesto-line">
            Forty-two stories.
          </p>
          <p className="manifesto-line text-[#898989]">
            42 great stories worth remembering.
          </p>
        </div>

        {/* 3 Active Titles in Development */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#f1f1ed]/10 font-mono text-xs">
          <div className="p-4 rounded border border-[#f1f1ed]/10 bg-[#0a0a0a] space-y-2">
            <span className="text-[#e50914] font-bold">01 // INSANE AiSYLUM</span>
            <p className="text-[#898989] text-[11px] leading-relaxed">
              A Japanese Psychological Science-Fiction Thriller. Setting: Japan • 2042.
            </p>
          </div>
          <div className="p-4 rounded border border-[#f1f1ed]/10 bg-[#0a0a0a] space-y-2">
            <span className="text-[#e52222] font-bold">02 // SUICIDE TRAIN</span>
            <p className="text-[#898989] text-[11px] leading-relaxed">
              Psychological Survival Action Thriller. 42 Passengers. 4 Hours. 1 Final Stop.
            </p>
          </div>
          <div className="p-4 rounded border border-[#f1f1ed]/10 bg-[#0a0a0a] space-y-2">
            <span className="text-[#f5a623] font-bold">03 // LIFE IS...</span>
            <p className="text-[#898989] text-[11px] leading-relaxed">
              A Four-Film Streaming Event. 4 Perspectives. 4 Truths. 4 Genres. One Family.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
