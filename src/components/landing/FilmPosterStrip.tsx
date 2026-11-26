"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { films } from "@/data/films";
import { useGSAPContext } from "@/hooks/useGSAPContext";

export default function FilmPosterStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % films.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX === null) return;

    const difference = touchStartX - event.changedTouches[0].clientX;

    if (difference > 45) {
      setActiveIndex((previous) => (previous + 1) % films.length);
    } else if (difference < -45) {
      setActiveIndex(
        (previous) => (previous - 1 + films.length) % films.length,
      );
    }

    setTouchStartX(null);
  };

  const activeFilm = films[activeIndex];

  useGSAPContext(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 84%",
          once: true,
        },
      });

      timeline
        .fromTo(
          ".film-strip-heading",
          { autoAlpha: 0, y: 42, filter: "blur(14px)", scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 1,
            ease: "power4.out",
          },
        )
        .fromTo(
          ".film-strip-stage",
          {
            autoAlpha: 0,
            y: 90,
            scale: 0.9,
            filter: "blur(18px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.3,
            ease: "power4.out",
          },
          "-=0.55",
        )
        .fromTo(
          ".film-strip-controls",
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" },
          "-=0.55",
        );

      gsap.fromTo(
        ".film-strip-glow",
        { yPercent: 12, scale: 0.88 },
        {
          yPercent: -14,
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.25,
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
      aria-label="Featured S•42 films"
      className="relative overflow-hidden bg-[#050505] px-4 py-20 select-none sm:py-24 lg:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        aria-hidden="true"
        className="film-strip-glow pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 50% 52%, ${activeFilm.palette.accent}1f 0%, transparent 36%)`,
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col">
        <div className="film-strip-heading relative z-40 flex flex-col items-center gap-2 text-center">
          <div
            className={`relative w-[92vw] max-w-[1000px] sm:w-[85vw] ${
              activeFilm.slug === "everyone-thinks-im-dead"
                ? "h-24 sm:h-32 md:h-42 lg:h-48"
                : "h-20 sm:h-28 md:h-36 lg:h-40"
            }`}
          >
            <Image
              key={activeFilm.slug}
              src={activeFilm.titleImage}
              alt={activeFilm.title}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 85vw, 1000px"
              className={`object-contain transition-opacity duration-300 ${
                activeFilm.slug === "everyone-thinks-im-dead"
                  ? "[filter:drop-shadow(0_0_12px_rgba(255,255,255,0.4))_drop-shadow(0_3px_10px_rgba(0,0,0,0.95))]"
                  : "[filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.75))]"
              }`}
            />
          </div>

          <p className="max-w-2xl px-4 font-sans text-sm font-light italic text-[#c5c5be] sm:text-base md:text-lg">
            &ldquo;{activeFilm.tagline}&rdquo;
          </p>
        </div>

        <div
          className="film-strip-stage relative z-10 mt-12 flex h-[320px] w-full shrink-0 items-center justify-center sm:mt-16 sm:h-[400px] md:h-[480px] lg:mt-20 lg:h-[540px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() =>
              setActiveIndex(
                (previous) =>
                  (previous - 1 + films.length) % films.length,
              )
            }
            aria-label="Previous film"
            className="group absolute left-2 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/75 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/70 hover:bg-black sm:left-6 sm:h-14 sm:w-14 md:left-12"
          >
            <span className="font-heading font-ethnocentric text-sm transition-transform group-hover:-translate-x-0.5 sm:text-base">
              ←
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveIndex((previous) => (previous + 1) % films.length)
            }
            aria-label="Next film"
            className="group absolute right-2 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/75 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/70 hover:bg-black sm:right-6 sm:h-14 sm:w-14 md:right-12"
          >
            <span className="font-heading font-ethnocentric text-sm transition-transform group-hover:translate-x-0.5 sm:text-base">
              →
            </span>
          </button>

          <div
            className="relative flex h-[300px] w-full items-center justify-center [--step:110px] sm:h-[380px] sm:[--step:165px] md:h-[460px] md:[--step:220px] lg:h-[520px] lg:[--step:275px] xl:[--step:315px]"
            style={{ perspective: "1200px", overflowX: "clip" }}
          >
            {films.map((film, index) => {
              const filmCount = films.length;
              let offset = (index - activeIndex) % filmCount;

              if (offset > filmCount / 2) offset -= filmCount;
              if (offset < -filmCount / 2) offset += filmCount;

              const isCenter = offset === 0;
              const absoluteOffset = Math.abs(offset);
              let horizontalMultiplier = 0;
              let scale = 1.06;
              let translateY = 0;
              let rotateY = 0;
              let opacity = 1;
              let zIndex = 30;

              if (absoluteOffset === 1) {
                horizontalMultiplier = offset;
                scale = 0.88;
                translateY = 12;
                rotateY = offset * -8;
                opacity = 0.85;
                zIndex = 20;
              } else if (absoluteOffset === 2) {
                horizontalMultiplier = offset * 1.8;
                scale = 0.72;
                translateY = 24;
                rotateY = offset * -14;
                opacity = 0.6;
                zIndex = 10;
              } else if (absoluteOffset >= 3) {
                horizontalMultiplier = offset * 2.4;
                scale = 0.58;
                translateY = 36;
                rotateY = offset * -20;
                opacity = 0;
                zIndex = 5;
              }

              return (
                <div
                  key={film.slug}
                  onClick={() => {
                    if (!isCenter) setActiveIndex(index);
                  }}
                  className={`absolute left-1/2 top-1/2 flex-shrink-0 cursor-pointer ${
                    absoluteOffset >= 2 ? "max-sm:hidden" : ""
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(calc(${horizontalMultiplier} * var(--step, 240px))) translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    transformOrigin: "center center",
                    zIndex,
                    opacity,
                    pointerEvents: opacity === 0 ? "none" : "auto",
                    transition:
                      "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-700 ${
                      isCenter ? "scale-105 opacity-90" : "opacity-25"
                    }`}
                    style={{ background: film.palette.accent }}
                  />

                  <Link
                    href={`/films/${film.slug}`}
                    onClick={(event) => {
                      if (!isCenter) {
                        event.preventDefault();
                        setActiveIndex(index);
                      }
                    }}
                    className={`relative block aspect-[2/3] w-[170px] overflow-hidden rounded-2xl bg-[#0d0d0d] transition-all duration-500 sm:w-[210px] md:w-[260px] lg:w-[300px] xl:w-[340px] ${
                      isCenter
                        ? "shadow-[0_35px_90px_rgba(0,0,0,0.98)] ring-1 ring-white/15"
                        : "shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                    }`}
                  >
                    <Image
                      src={film.posterImage}
                      alt={film.title}
                      fill
                      sizes="(max-width: 640px) 170px, (max-width: 1024px) 260px, 340px"
                      className={`object-cover transition-transform duration-700 ${
                        isCenter
                          ? "scale-100 brightness-110 contrast-105"
                          : "brightness-90 hover:brightness-105"
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="film-strip-controls mx-auto mt-6 flex w-full max-w-5xl flex-col items-center justify-center gap-5 px-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {films.map((film, index) => (
              <button
                type="button"
                key={film.slug}
                onClick={() => setActiveIndex(index)}
                aria-label={`Select ${film.title}`}
                className={`h-2 cursor-pointer rounded-full transition-all duration-300 sm:h-2.5 ${
                  index === activeIndex
                    ? "w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] sm:w-10"
                    : "w-2 bg-white/25 hover:bg-white/50 sm:w-2.5"
                }`}
                style={
                  index === activeIndex
                    ? { backgroundColor: film.palette.accent }
                    : undefined
                }
              />
            ))}
          </div>

          <Link
            href="/films"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/60 px-6 py-3 font-heading font-ethnocentric text-[10px] uppercase tracking-widest text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black sm:text-xs"
          >
            <span>Explore Our Films</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
