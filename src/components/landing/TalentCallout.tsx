"use client";

import Image from "next/image";
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
          ".talent-kicker",
          { autoAlpha: 0, x: -28, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
          },
        )
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
          "-=0.38",
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
        )
        .fromTo(
          ".talent-visual",
          {
            autoAlpha: 0,
            x: 74,
            scale: 0.94,
            filter: "blur(16px)",
          },
          {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power4.out",
          },
          "-=0.78",
        )
        .fromTo(
          ".talent-trait",
          { autoAlpha: 0, y: 20, scale: 0.86 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.58,
            stagger: 0.1,
            ease: "back.out(1.5)",
          },
          "-=0.58",
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
      className="relative overflow-hidden bg-[#050505] px-6 py-24 sm:px-10 sm:py-32 md:px-16 md:py-36 lg:px-20 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="talent-aurora pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "conic-gradient(from 210deg, transparent 0deg, rgba(201,168,76,0.13) 80deg, rgba(218,225,235,0.12) 145deg, transparent 235deg)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 xl:gap-28">
        <div className="flex flex-col items-start text-left">
          <p className="talent-kicker mb-7 font-heading font-ethnocentric text-[9px] uppercase tracking-[0.24em] text-[#b38a43] sm:mb-9 sm:text-[10px]">
            For Talent
          </p>

          <h2
            id="talent-callout-title"
            className="talent-headline bg-clip-text font-heading font-ethnocentric text-[clamp(0.72rem,2.15vw,2.65rem)] leading-[1.18] tracking-[0.025em] text-transparent [filter:drop-shadow(0_5px_24px_rgba(222,225,230,0.14))]"
            style={{
              backgroundImage:
                "linear-gradient(112deg, #6d7178 0%, #f1f3f5 28%, #969ba3 52%, #ffffff 72%, #70747b 100%)",
              WebkitBackgroundClip: "text",
            }}
          >
            <span className="block whitespace-nowrap">
              DON&apos;T JUST WATCH THE FUTURE.
            </span>
            <span className="mt-3 block sm:mt-4">BUILD IT.</span>
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

        <div className="talent-visual relative mx-auto w-full max-w-[650px] lg:mx-0 lg:ml-auto">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] shadow-[0_30px_100px_rgba(0,0,0,0.72)]">
            <Image
              src="/images/brand/talent-collaboration.png"
              alt="Creative collaborators working together in cinematic light"
              fill
              sizes="(max-width: 1023px) 90vw, 46vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_40%,rgba(5,5,5,0.82)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(201,168,76,0.09),transparent_44%)]" />
          </div>

          <div className="talent-trait absolute -left-3 top-[15%] border border-white/15 bg-black/75 px-4 py-3 backdrop-blur-md sm:-left-8 lg:-left-12">
            <span className="block font-heading font-ethnocentric text-[7px] uppercase tracking-[0.18em] text-[#dddeda] sm:text-[8px]">
              Creative Instinct
            </span>
          </div>
          <div className="talent-trait absolute -right-3 top-[34%] border border-[#c9a84c]/25 bg-black/75 px-4 py-3 backdrop-blur-md sm:-right-8 lg:-right-10">
            <span className="block font-heading font-ethnocentric text-[7px] uppercase tracking-[0.18em] text-[#d7bb72] sm:text-[8px]">
              AI Fluency
            </span>
          </div>
          <div className="talent-trait absolute -left-3 bottom-[27%] border border-white/15 bg-black/75 px-4 py-3 backdrop-blur-md sm:-left-8 lg:-left-12">
            <span className="block font-heading font-ethnocentric text-[7px] uppercase tracking-[0.18em] text-[#dddeda] sm:text-[8px]">
              Cinematic Craft
            </span>
          </div>
          <div className="talent-trait absolute -right-3 bottom-[11%] border border-[#c9a84c]/25 bg-black/75 px-4 py-3 backdrop-blur-md sm:-right-8 lg:-right-10">
            <span className="block font-heading font-ethnocentric text-[7px] uppercase tracking-[0.18em] text-[#d7bb72] sm:text-[8px]">
              Bold Collaboration
            </span>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute -left-10 top-[15%] hidden h-px w-10 bg-gradient-to-r from-transparent to-white/35 lg:block" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-[34%] hidden h-px w-10 bg-gradient-to-l from-transparent to-[#c9a84c]/45 lg:block" />
        </div>
      </div>
    </section>
  );
}
