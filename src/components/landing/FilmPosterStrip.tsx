"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { films } from "@/data/films";
import { useGSAPContext } from "@/hooks/useGSAPContext";

export default function FilmPosterStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
          ".poster-wall-heading",
          { autoAlpha: 0, y: 48, scale: 0.95, filter: "blur(16px)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power4.out",
          },
        )
        .fromTo(
          ".poster-wall-reveal",
          {
            autoAlpha: 0,
            y: (index) => (index % 2 === 0 ? 100 : 145),
            rotationY: (index) => (index % 2 === 0 ? -8 : 8),
            scale: 0.9,
            filter: "blur(14px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            rotationY: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.15,
            stagger: 0.075,
            ease: "power4.out",
          },
          "-=0.45",
        )
        .fromTo(
          ".poster-wall-footer",
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" },
          "-=0.42",
        );

      gsap.fromTo(
        ".poster-wall-ambient",
        { yPercent: 14, scale: 0.88 },
        {
          yPercent: -12,
          scale: 1.12,
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
      id="films"
      aria-labelledby="poster-wall-title"
      className="relative overflow-hidden bg-[#020202] px-6 pb-24 pt-24 select-none sm:px-8 sm:pb-32 sm:pt-32 lg:px-10 lg:pb-36 lg:pt-36"
    >
      <div
        aria-hidden="true"
        className="poster-wall-ambient pointer-events-none absolute left-1/2 top-[52%] h-[720px] w-[1250px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.12) 0%, rgba(117,121,130,0.08) 32%, transparent 72%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        <div className="poster-wall-heading mx-auto mb-12 max-w-6xl text-center sm:mb-16 lg:mb-20">
          <h2
            id="poster-wall-title"
            className="bg-clip-text font-heading font-ethnocentric text-[clamp(1.45rem,4vw,4.25rem)] leading-[1.02] tracking-[0.025em] text-transparent [filter:drop-shadow(0_5px_24px_rgba(222,225,230,0.1))]"
            style={{
              backgroundImage:
                "linear-gradient(112deg, #6b6f76 0%, #f0f2f4 28%, #969ba3 52%, #ffffff 72%, #70747b 100%)",
              WebkitBackgroundClip: "text",
            }}
          >
            ORIGINAL STORIES. LIMITLESS WORLDS.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-sans text-base font-light tracking-[0.01em] text-[#85857f] sm:text-lg">
            Each story opens a different door. Choose a world to enter.
          </p>
        </div>

        <div
          className="poster-wall-track -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-8 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:gap-5"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {films.map((film, index) => {
            const isFocused = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && !isFocused;

            return (
              <div
                key={film.slug}
                className={`poster-wall-reveal w-[72vw] max-w-[300px] flex-none snap-center md:col-span-2 md:w-auto md:max-w-none ${
                  index === 4 ? "md:col-start-2" : ""
                }`}
                style={{ perspective: "1200px" }}
              >
                <Link
                  href={`/films/${film.slug}`}
                  aria-label={`Explore ${film.title}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  className={`group relative block aspect-[2/3] w-full overflow-hidden rounded-[18px] border bg-[#090909] shadow-[0_28px_80px_rgba(0,0,0,0.82)] transition-[transform,filter,opacity,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:aspect-auto md:h-[58vh] md:min-h-[470px] md:max-h-[690px] ${
                    isFocused
                      ? "z-20 border-white/20 brightness-100 saturate-100 md:scale-[1.055] md:border-white/35 md:brightness-110 md:saturate-110 md:shadow-[0_34px_100px_rgba(0,0,0,0.95)]"
                      : isDimmed
                        ? "border-white/10 brightness-100 saturate-100 md:scale-[0.985] md:border-white/[0.04] md:brightness-[0.34] md:saturate-[0.45] md:opacity-75"
                        : "border-white/10 brightness-100 saturate-100 hover:border-white/25"
                  }`}
                  style={
                    isFocused
                      ? {
                          boxShadow: `0 32px 110px rgba(0,0,0,0.94), 0 0 48px ${film.palette.accent}38`,
                        }
                      : undefined
                  }
                >
                  <Image
                    src={film.posterImage}
                    alt={film.title}
                    fill
                    sizes="(max-width: 767px) 72vw, 14vw"
                    className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                  />

                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
                      isFocused ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background: `linear-gradient(145deg, ${film.palette.accent}24, transparent 46%)`,
                    }}
                  />

                </Link>
              </div>
            );
          })}
        </div>

        <div className="poster-wall-footer mt-9 flex items-center justify-center text-center sm:mt-12">
          <Link
            href="/films"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 font-heading font-ethnocentric text-[9px] uppercase tracking-[0.15em] text-white transition-all duration-300 hover:scale-105 hover:border-white/45 hover:bg-white hover:text-black sm:text-[10px]"
          >
            <span>Explore Our Films</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
