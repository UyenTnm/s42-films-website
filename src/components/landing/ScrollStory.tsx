"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { films } from "@/data/films";
import { useLenis } from "@/hooks/useLenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const filmRows = [
  ["insane-aisylum", "suicide-train"],
  ["the-sum-of-me", "memories-i-am", "everyone-thinks-im-dead"],
  ["l-42-06", "life-is"],
].map((row) => row.map((slug) => films.find((film) => film.slug === slug)!));

export default function ScrollStory() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const posterSceneRef = useRef<HTMLDivElement>(null);
  const previewRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [hoveredPreviewKey, setHoveredPreviewKey] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    const hero = heroRef.current;
    const statement = statementRef.current;
    const posterScene = posterSceneRef.current;

    if (!section || !intro || !hero || !statement || !posterScene) return;

    const context = gsap.context(() => {
      const statementLines = gsap.utils.toArray<HTMLElement>(
        ".scroll-story-statement-line",
      );
      const statementCopy = statement.querySelector<HTMLElement>(
        ".scroll-story-statement-copy",
      );
      const statementCue = statement.querySelector<HTMLElement>(
        ".scroll-story-statement-cue",
      );
      const posterHeading = posterScene.querySelector<HTMLElement>(
        ".scroll-story-poster-heading",
      );
      const posterCards = gsap.utils.toArray<HTMLElement>(
        ".scroll-story-poster-card",
      );
      const posterFooter = posterScene.querySelector<HTMLElement>(
        ".scroll-story-poster-footer",
      );

      gsap.set(hero, { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
      gsap.set(statement, { autoAlpha: 0 });
      gsap.set(statementLines, {
        autoAlpha: 0,
        y: 68,
        scale: 0.92,
        filter: "blur(18px)",
      });
      gsap.set([statementCopy, statementCue], {
        autoAlpha: 0,
        y: 28,
        filter: "blur(10px)",
      });
      gsap.set(posterScene, { autoAlpha: 1 });
      gsap.set(posterHeading, {
        autoAlpha: 0,
        y: 44,
        scale: 0.95,
        filter: "blur(14px)",
      });
      gsap.set(posterCards, {
        autoAlpha: 0,
        y: (index) => (index % 2 === 0 ? 58 : 82),
        scale: 0.88,
        filter: "blur(12px)",
      });
      gsap.set(posterFooter, { autoAlpha: 0, y: 22 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: intro,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to({}, { duration: 0.75 })
        .to(hero, {
          autoAlpha: 0,
          scale: 1.055,
          filter: "blur(8px)",
          duration: 1.05,
          ease: "power2.in",
        })
        .set(statement, { autoAlpha: 1 }, "-=0.18")
        .to(
          statementLines,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .to(
          statementCopy,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.42",
        )
        .to(
          statementCue,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.45,
          },
          "-=0.28",
        )
        .to({}, { duration: 1.25 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: posterScene,
            start: "top 82%",
            once: true,
          },
        })
        .to(
          posterHeading,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
          },
          0,
        )
        .to(
          posterCards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.58,
            stagger: 0.04,
            ease: "power3.out",
          },
          0.12,
        )
        .to(
          posterFooter,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          0.34,
        );
    }, section);

    return () => context.revert();
  }, []);

  const scrollToStatement = () => {
    const target = document.querySelector<HTMLElement>("#imagination");
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { duration: 1.45 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const startFilmPreview = (previewKey: string) => {
    if (
      !window.matchMedia(
        "(min-width: 768px) and (hover: hover) and (pointer: fine)",
      ).matches
    ) {
      return;
    }

    setHoveredPreviewKey(previewKey);

    const preview = previewRefs.current[previewKey];
    if (!preview) return;

    preview.currentTime = 0;
    preview.play().catch(() => {});
  };

  const stopFilmPreview = (previewKey: string) => {
    setHoveredPreviewKey(null);

    const preview = previewRefs.current[previewKey];
    if (!preview) return;

    preview.pause();
    preview.currentTime = 0;
  };

  return (
    <section
      ref={sectionRef}
      aria-label="S•42 cinematic introduction"
      className="relative bg-black"
    >
      <div ref={introRef} className="relative h-[420svh]">
        <div
          id="imagination"
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[32%] h-px w-px"
        />

        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#020202]">
          <div
            ref={heroRef}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black"
          >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-contain"
          >
            <source src="/video/s42-hero-v2-h264.mp4" type="video/mp4" />
            <source src="/video/s42-hero-v2.mp4" type="video/mp4" />
          </video>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 38%, rgba(0,0,0,0.7) 100%)",
            }}
          />

          <button
            type="button"
            onClick={scrollToStatement}
            className="group absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2"
          >
            <span className="font-heading font-ethnocentric text-[8px] uppercase tracking-[0.3em] text-white/55 transition-colors group-hover:text-white/90 sm:text-[9px]">
              Discover S•42
            </span>
            <span className="flex h-9 w-9 animate-bounce items-center justify-center rounded-full border border-white/20 bg-black/30 font-sans text-sm text-white/60 backdrop-blur-sm transition group-hover:border-white/55 group-hover:text-white">
              ↓
            </span>
          </button>
          </div>

          <div
            ref={statementRef}
            className="invisible absolute inset-0 z-20 flex items-center justify-center bg-[#030303] px-6 pt-20 sm:px-10 md:px-16"
          >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[55vw] max-h-[780px] min-h-[360px] w-[88vw] max-w-[1180px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[conic-gradient(from_205deg,transparent_0deg,rgba(183,187,194,0.12)_72deg,rgba(201,168,76,0.1)_132deg,transparent_225deg)] blur-[120px]"
          />

          <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col items-center text-center">
            <h1 className="font-heading font-ethnocentric text-[clamp(2rem,7.25vw,7.2rem)] leading-[0.92] tracking-[0.035em]">
              {[
                {
                  label: "IMAGINATION.",
                  gradient:
                    "linear-gradient(112deg, #6d4b1e 0%, #f2d48b 28%, #a87428 52%, #fff0b5 72%, #76501e 100%)",
                  shadow: "drop-shadow(0 5px 28px rgba(201,168,76,0.16))",
                },
                {
                  label: "ENGINEERED.",
                  gradient:
                    "linear-gradient(112deg, #666a71 0%, #f0f2f4 28%, #979ca4 52%, #ffffff 72%, #6f737a 100%)",
                  shadow: "drop-shadow(0 5px 28px rgba(222,225,230,0.12))",
                },
              ].map((line) => (
                <span
                  key={line.label}
                  className="scroll-story-statement-line mt-3 block bg-clip-text text-transparent first:mt-0 sm:mt-5"
                  style={{
                    backgroundImage: line.gradient,
                    WebkitBackgroundClip: "text",
                    filter: line.shadow,
                  }}
                >
                  {line.label}
                </span>
              ))}
            </h1>

            <p className="scroll-story-statement-copy mt-9 max-w-4xl font-sans text-base font-light leading-relaxed tracking-[0.01em] text-[#92928d] sm:mt-12 sm:text-lg md:text-xl lg:text-2xl lg:leading-relaxed">
              We bring human imagination to life through advanced artificial
              intelligence, cinematic craftsmanship and emerging creative
              technologies.
            </p>

            <div className="scroll-story-statement-cue mt-14 flex flex-col items-center gap-3 text-[#676762] sm:mt-20">
              <span className="font-heading font-ethnocentric text-[8px] uppercase tracking-[0.22em] sm:text-[9px]">
                Enter the worlds
              </span>
              <span className="font-sans text-lg">↓</span>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div
        id="films"
        ref={posterSceneRef}
        aria-labelledby="scroll-story-poster-title"
        className="scroll-story-poster-scene invisible relative z-10 flex w-full justify-center overflow-hidden bg-[#020202] px-3 pb-20 pt-28 select-none sm:px-5 sm:pb-24 sm:pt-32 lg:px-7 lg:pb-32"
      >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[58%] h-[70svh] w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.12)_0%,rgba(117,121,130,0.08)_34%,transparent_72%)] blur-[120px]"
          />

          <div className="relative z-10 flex w-full flex-col items-center">
            <div className="scroll-story-poster-heading pointer-events-none mb-5 px-4 text-center sm:mb-7">
              <h2
                id="scroll-story-poster-title"
                className="whitespace-nowrap bg-clip-text font-heading font-ethnocentric text-[clamp(0.86rem,2.4vw,2.4rem)] leading-none tracking-[0.02em] text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(112deg, #777b82 0%, #f4f5f6 30%, #a7abb1 52%, #ffffff 72%, #73777e 100%)",
                  WebkitBackgroundClip: "text",
                  filter:
                    "drop-shadow(0 5px 4px rgba(0,0,0,1)) drop-shadow(0 15px 18px rgba(0,0,0,0.98))",
                }}
              >
                ORIGINAL STORIES.
              </h2>
            </div>

            <div className="scroll-story-film-grid">
              {filmRows.map((rowFilms, rowIndex) => (
                <div
                  key={`film-row-${rowIndex}`}
                  className={`scroll-story-film-row ${
                    rowFilms.length === 2 ? "is-two" : "is-three"
                  }`}
                >
                  {rowFilms.map((film) => {
                    const previewKey = film.slug;
                    const isFocused = hoveredPreviewKey === previewKey;
                    const isDimmed =
                      hoveredPreviewKey !== null && !isFocused;

                    return (
                      <div
                        key={film.slug}
                        className="scroll-story-poster-card scroll-story-fixed-card"
                      >
                        <Link
                          href={`/films/${film.slug}`}
                          aria-label={`Explore ${film.title}`}
                          onMouseEnter={() => startFilmPreview(previewKey)}
                          onMouseLeave={() => stopFilmPreview(previewKey)}
                          onFocus={() => startFilmPreview(previewKey)}
                          onBlur={() => stopFilmPreview(previewKey)}
                          className={`group relative block h-full w-full overflow-hidden border bg-[#090909] shadow-[0_20px_55px_rgba(0,0,0,0.86)] transition-[transform,filter,opacity,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isFocused
                              ? "z-20 border-transparent brightness-100 saturate-100 md:scale-[1.025] md:brightness-110 md:saturate-110"
                              : isDimmed
                                ? "border-white/[0.04] brightness-100 saturate-100 md:brightness-[0.34] md:saturate-[0.45] md:opacity-70"
                                : "border-white/10 brightness-100 saturate-100 hover:border-white/25"
                          }`}
                          style={
                            isFocused
                              ? {
                                  boxShadow: `0 28px 90px rgba(0,0,0,0.95), 0 0 42px ${film.palette.accent}36`,
                                }
                              : undefined
                          }
                        >
                          <Image
                            src={film.landscapeImage ?? film.posterImage}
                            alt={film.title}
                            fill
                            sizes="(max-width: 639px) 48vw, (max-width: 1023px) 46vw, 32vw"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                          />
                          {film.highlightVideo ? (
                            <video
                              ref={(preview) => {
                                previewRefs.current[previewKey] = preview;
                              }}
                              muted
                              loop
                              playsInline
                              preload="none"
                              poster={
                                film.landscapeImage ?? film.posterImage
                              }
                              aria-hidden="true"
                              className={`pointer-events-none absolute inset-0 hidden h-full w-full object-cover transition-opacity duration-500 md:block ${
                                isFocused ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              <source
                                src={film.highlightVideo}
                                type="video/mp4"
                              />
                            </video>
                          ) : null}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="scroll-story-poster-footer mt-5 flex w-full max-w-4xl items-center justify-center sm:mt-7">
              <Link
                href="/films"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 font-heading font-ethnocentric text-[7px] uppercase tracking-[0.15em] text-white transition-all duration-300 hover:scale-105 hover:border-white/45 hover:bg-white hover:text-black sm:text-[8px] lg:px-6 lg:py-3 lg:text-[9px]"
              >
                <span>Explore Our Films</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
      </div>
    </section>
  );
}
