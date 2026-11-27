"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAPContext } from "@/hooks/useGSAPContext";

export default function TalentCallout() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          once: true,
        },
      });

      timeline
        .fromTo(
          ".talent-headline",
          {
            autoAlpha: 0,
            y: 70,
            scale: 0.94,
            filter: "blur(18px)",
            letterSpacing: "0.09em",
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            letterSpacing: "0.025em",
            duration: 1.25,
            ease: "power4.out",
          },
        )
        .fromTo(
          ".talent-cta",
          { autoAlpha: 0, y: 24, scale: 0.9 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.5)",
          },
          "-=0.5",
        );

      gsap.fromTo(
        ".talent-aurora",
        { xPercent: -22, rotation: -8, scale: 0.86 },
        {
          xPercent: 22,
          rotation: 8,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );
    },
    sectionRef,
    [],
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="talent-callout-title"
      className="relative overflow-hidden bg-[#050505] px-6 py-28 sm:px-10 sm:py-36 md:px-16 md:py-44"
    >
      <div
        aria-hidden="true"
        className="talent-aurora pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "conic-gradient(from 210deg, transparent 0deg, rgba(201,168,76,0.13) 80deg, rgba(218,225,235,0.12) 145deg, transparent 235deg)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <h2
          id="talent-callout-title"
          className="talent-headline bg-clip-text font-heading font-ethnocentric text-[clamp(0.82rem,3.2vw,3.4rem)] leading-[1.12] tracking-[0.025em] text-transparent [filter:drop-shadow(0_5px_24px_rgba(222,225,230,0.14))]"
          style={{
            backgroundImage:
              "linear-gradient(112deg, #6d7178 0%, #f1f3f5 28%, #969ba3 52%, #ffffff 72%, #70747b 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          <span className="block whitespace-nowrap">
            DON&apos;T JUST WATCH THE FUTURE.
          </span>
          <span className="mt-2 block sm:mt-3">BUILD IT.</span>
        </h2>

        <Link
          href="/careers"
          className="talent-cta group mt-12 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white px-7 py-3.5 font-heading font-ethnocentric text-[10px] uppercase tracking-[0.16em] text-black transition-all duration-300 hover:scale-105 hover:bg-[#d8d8d2] sm:mt-14 sm:px-9 sm:py-4 sm:text-xs"
        >
          <span>Join S•42</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
