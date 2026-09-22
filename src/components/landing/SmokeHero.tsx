"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { films } from "@/data/films";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ══════════════════════════════════════════════════════════════
//  Volumetric Smoke Particle System
//  30 soft radial-gradient ellipses across 3 depth layers.
//  Canvas uses "screen" blend mode → luminous white on dark bg.
// ══════════════════════════════════════════════════════════════

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  sx: number; // ellipse x-scale
  sy: number; // ellipse y-scale
  rot: number;
  rotV: number;
  alpha: number;
  lum: number; // 0–1 lightness
}

const LAYER_CONFIGS = [
  {
    rMin: 380,
    rMax: 720,
    aMin: 0.055,
    aMax: 0.1,
    vyMin: -0.28,
    vyMax: -0.14,
    vxMax: 0.12,
  },
  {
    rMin: 210,
    rMax: 430,
    aMin: 0.09,
    aMax: 0.17,
    vyMin: -0.55,
    vyMax: -0.3,
    vxMax: 0.2,
  },
  {
    rMin: 120,
    rMax: 270,
    aMin: 0.15,
    aMax: 0.27,
    vyMin: -0.92,
    vyMax: -0.52,
    vxMax: 0.3,
  },
] as const;

function makeParticle(W: number, H: number, layer: 0 | 1 | 2): Particle {
  const L = LAYER_CONFIGS[layer];
  const r = L.rMin + Math.random() * (L.rMax - L.rMin);
  return {
    x: Math.random() * (W + r * 2) - r,
    y: Math.random() * (H + r * 2) - r,
    vx: (Math.random() - 0.5) * 2 * L.vxMax,
    vy: L.vyMin + Math.random() * (L.vyMax - L.vyMin),
    r,
    sx: 0.8 + Math.random() * 0.75,
    sy: 0.6 + Math.random() * 0.6,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.0045,
    alpha: L.aMin + Math.random() * (L.aMax - L.aMin),
    lum: 0.7 + Math.random() * 0.24,
  };
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  gAlpha: number,
) {
  ctx.save();
  ctx.globalAlpha = p.alpha * gAlpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.scale(p.sx, p.sy);
  const l = Math.round(p.lum * 100);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r);
  g.addColorStop(0, `hsl(218,20%,${l}%)`);
  g.addColorStop(0.45, `hsla(216,16%,${Math.round(l * 0.52)}%,0.42)`);
  g.addColorStop(1, `hsla(212,12%,22%,0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, p.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ══════════════════════════════════════════════════════════════
//  Hero Video Source
//  Set this to your video path (e.g. "/video/s42-intro.mp4") once
//  uploaded to public/video/. Set to null to use the logo animation.
// ══════════════════════════════════════════════════════════════
const HERO_VIDEO_SRC: string | null = "/video/s42-hero.mp4";

// ══════════════════════════════════════════════════════════════
//  Component
// ══════════════════════════════════════════════════════════════
export default function SmokeHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smokeLayerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const smokeAlpha = useRef(1);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Canvas smoke render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function init() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const W = canvas.width;
      const H = canvas.height;
      const ps: Particle[] = [];
      for (let i = 0; i < 10; i++) ps.push(makeParticle(W, H, 0));
      for (let i = 0; i < 12; i++) ps.push(makeParticle(W, H, 1));
      for (let i = 0; i < 8; i++) ps.push(makeParticle(W, H, 2));
      particlesRef.current = ps;
    }

    init();

    let animId = 0;
    function tick() {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const gA = smokeAlpha.current;

      ctx.clearRect(0, 0, W, H);

      if (gA > 0.005) {
        ctx.globalCompositeOperation = "screen";
        for (const p of particlesRef.current) {
          drawParticle(ctx, p, gA);
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.rotV;
          if (p.y + p.r * p.sy < -10) {
            p.y = H + p.r * p.sy + 10;
            p.x = Math.random() * (W + p.r * 2) - p.r;
          }
          const ov = p.r * p.sx + 60;
          if (p.x - ov > W) p.x = -ov;
          if (p.x + ov < 0) p.x = W + ov;
        }
        ctx.globalCompositeOperation = "source-over";
      }
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  // GSAP entry + scroll dissolve
  useLayoutEffect(() => {
    const el = {
      wrapper: wrapperRef.current,
      smoke: smokeLayerRef.current,
      logo: logoRef.current,
      poster: posterRef.current,
      hint: hintRef.current,
      overlay: overlayRef.current,
    };
    if (Object.values(el).some((v) => !v)) return;

    const entry = gsap.timeline({ delay: 0.15 });

    if (HERO_VIDEO_SRC) {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      entry
        .set(el.logo, { opacity: 0 })
        .to(el.overlay, { opacity: 0, duration: 0.3, ease: "power1.out" })
        .to(
          el.logo,
          { opacity: 1, duration: 1.6, ease: "power2.out" },
          "-=0.15"
        )
        .fromTo(
          el.hint,
          { opacity: 0 },
          { opacity: 1, duration: 1.1, ease: "power2.out" },
          "-=0.9"
        );
    } else {
      entry
        .set(el.logo, { opacity: 0, y: 38, scale: 0.97 })
        .to(el.overlay, { opacity: 0, duration: 0.3, ease: "power1.out" })
        .to(
          el.logo,
          { opacity: 1, y: 0, scale: 1, duration: 2.0, ease: "power4.out" },
          "-=0.15"
        )
        .fromTo(
          el.hint,
          { opacity: 0 },
          { opacity: 1, duration: 1.1, ease: "power2.out" },
          "-=0.9"
        );
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el.wrapper,
        start: "top top",
        end: "62% top",
        scrub: 1.4,
        onUpdate: (self) => {
          const p = self.progress;
          smokeAlpha.current = Math.max(0, 1 - p * 1.55);
          gsap.set(el.smoke, {
            opacity: Math.max(0, 1 - p * 1.25),
            scale: 1 + p * 0.24,
            yPercent: p * -8,
          });
          if (HERO_VIDEO_SRC) {
            gsap.set(el.logo, { opacity: Math.max(0, 1 - p * 2.5) });
          } else {
            gsap.set(el.logo, { opacity: Math.max(0, 1 - p * 3.2), y: p * -55 });
          }
          gsap.set(el.poster, {
            opacity: Math.max(0, (p - 0.28) / 0.72),
            pointerEvents: p > 0.35 ? "auto" : "none",
          });
          gsap.set(el.hint, { opacity: Math.max(0, 1 - p * 12) });
        },
      });
    }, el.wrapper!);

    return () => {
      entry.kill();
      ctx.revert();
    };
  }, []);

  const [activeIndex, setActiveIndex] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      // Swiped left -> Next
      setActiveIndex((prev) => (prev + 1) % films.length);
    } else if (diff < -45) {
      // Swiped right -> Prev
      setActiveIndex((prev) => (prev - 1 + films.length) % films.length);
    }
    setTouchStartX(null);
  };

  // Auto-flow carousel effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % films.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div ref={wrapperRef} style={{ height: "260vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        <div
          ref={overlayRef}
          className="absolute inset-0 z-[999] bg-[#050505] pointer-events-none"
          style={{ opacity: 1 }}
        />

        {/* 0 ─ Poster reveal layer: ANIMATED 3D FLOWING COVERFLOW */}
        <div
          ref={posterRef}
          className="absolute inset-0 z-25 opacity-0 pointer-events-none flex flex-col justify-between py-6 sm:py-10 px-4 select-none"
          style={{ zIndex: 25 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Active Film Header info */}
          <div className="relative z-30 flex flex-col items-center text-center gap-2 pt-2 sm:pt-4 pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="font-heading font-ethnocentric text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#f1f1ed]/80 bg-black/60 px-3.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
                FEATURED REVEAL // {films[activeIndex].number} OF 07
              </span>
            </div>

            {/* Official Film Title Logo Graphic - Extra Large & Prominent */}
            <div
              className={`relative my-1 sm:my-2 w-[92vw] sm:w-[85vw] ${
                films[activeIndex].slug === "everyone-thinks-im-dead"
                  ? "h-24 sm:h-32 md:h-42 lg:h-48 md:w-[920px] lg:w-[1040px] max-w-[1060px]"
                  : "h-20 sm:h-28 md:h-36 lg:h-40 md:w-[850px] lg:w-[950px] max-w-[1000px]"
              }`}
            >
              <Image
                key={films[activeIndex].slug}
                src={films[activeIndex].titleImage}
                alt={films[activeIndex].title}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 85vw, 1000px"
                className={`object-contain transition-opacity duration-300 ${
                  films[activeIndex].slug === "everyone-thinks-im-dead"
                    ? "[filter:drop-shadow(0_0_12px_rgba(255,255,255,0.4))_drop-shadow(0_3px_10px_rgba(0,0,0,0.95))]"
                    : "[filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.75))]"
                }`}
                priority
              />
            </div>

            <p className="font-sans text-sm sm:text-base md:text-lg text-[#c5c5be] font-light max-w-2xl italic px-4">
              &ldquo;{films[activeIndex].tagline}&rdquo;
            </p>
          </div>

          {/* 3D Flowing Coverflow Stage - Active poster ALWAYS flows to middle position */}
          <div
            className="relative w-full flex-1 flex items-center justify-center my-auto pointer-events-auto min-h-[300px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[520px]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Prev Arrow Button */}
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + films.length) % films.length)
              }
              aria-label="Previous film"
              className="absolute left-2 sm:left-6 md:left-12 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/75 hover:bg-black border border-white/20 hover:border-white/70 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-md cursor-pointer group"
            >
              <span className="font-heading font-ethnocentric text-sm sm:text-base group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>
            </button>

            {/* Right Next Arrow Button */}
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % films.length)}
              aria-label="Next film"
              className="absolute right-2 sm:right-6 md:right-12 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/75 hover:bg-black border border-white/20 hover:border-white/70 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-md cursor-pointer group"
            >
              <span className="font-heading font-ethnocentric text-sm sm:text-base group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </button>

            {/* Carousel Stage - All posters positioned relative to center */}
            <div
              className="relative w-full h-[290px] sm:h-[370px] md:h-[450px] lg:h-[510px] flex items-center justify-center [--step:110px] sm:[--step:165px] md:[--step:220px] lg:[--step:275px] xl:[--step:315px]"
              style={{ perspective: "1200px", overflowX: "clip" }}
            >
              {films.map((film, i) => {
                const n = films.length;
                let offset = (i - activeIndex) % n;
                if (offset > n / 2) offset -= n;
                if (offset < -n / 2) offset += n;
                const isCenter = offset === 0;
                const absOffset = Math.abs(offset);

                // Calculate 3D coverflow styling dynamically
                let xMult = 0;
                let scale = 1.06;
                let translateY = 0;
                let rotateY = 0;
                let opacity = 1;
                let zIndex = 30;

                if (absOffset === 0) {
                  xMult = 0;
                  scale = 1.06;
                  translateY = 0;
                  rotateY = 0;
                  opacity = 1;
                  zIndex = 30;
                } else if (absOffset === 1) {
                  xMult = offset; // ±1
                  scale = 0.88;
                  translateY = 12;
                  rotateY = offset * -8;
                  opacity = 0.85;
                  zIndex = 20;
                } else if (absOffset === 2) {
                  xMult = offset * 1.8;
                  scale = 0.72;
                  translateY = 24;
                  rotateY = offset * -14;
                  opacity = 0.6;
                  zIndex = 10;
                } else {
                  // In wings (absOffset >= 3)
                  xMult = offset * 2.4;
                  scale = 0.58;
                  translateY = 36;
                  rotateY = offset * -20;
                  opacity = 0; // Fully invisible in wings for clean wrap
                  zIndex = 5;
                }

                // On small mobile screens, hide offset >= 2 to keep center poster prominent
                const isMobileHidden = absOffset >= 2;

                return (
                  <div
                    key={film.slug}
                    onClick={() => {
                      if (!isCenter) setActiveIndex(i);
                    }}
                    className={`absolute left-1/2 top-1/2 cursor-pointer flex-shrink-0 select-none ${
                      isMobileHidden ? "max-sm:hidden" : ""
                    }`}
                    style={{
                      transform: `translate(-50%, -50%) translateX(calc(${xMult} * var(--step, 240px))) translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg)`,
                      transformOrigin: "center center",
                      zIndex,
                      opacity,
                      pointerEvents: opacity === 0 ? "none" : "auto",
                      transition:
                        "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {/* Ambient Backlit Glow for Active & Flanking Posters */}
                    <div
                      className={`absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-700 pointer-events-none ${
                        isCenter
                          ? "opacity-90 scale-105"
                          : "opacity-25 group-hover:opacity-50"
                      }`}
                      style={{ background: film.palette.accent }}
                    />

                    {/* Poster Card Container — Clean Cinema Artwork (No numbers, no title overlay) */}
                    <Link
                      href={`/films/${film.slug}`}
                      onClick={(e) => {
                        if (!isCenter) {
                          e.preventDefault();
                          setActiveIndex(i);
                        }
                      }}
                      className={`relative block w-[170px] sm:w-[210px] md:w-[260px] lg:w-[300px] xl:w-[340px] aspect-[2/3] rounded-2xl overflow-hidden transition-all duration-500 bg-[#0d0d0d] ${
                        isCenter
                          ? "shadow-[0_35px_90px_rgba(0,0,0,0.98)] ring-1 ring-white/15"
                          : "shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                      }`}
                    >
                      {/* High-Resolution Poster Image */}
                      <Image
                        src={film.posterImage}
                        alt={film.title}
                        fill
                        sizes="(max-width: 640px) 170px, (max-width: 1024px) 260px, 340px"
                        className={`object-cover transition-transform duration-700 ${
                          isCenter
                            ? "brightness-110 contrast-105 scale-100"
                            : "brightness-90 hover:brightness-105"
                        }`}
                        priority
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Pagination Dots & Explore CTA */}
          <div className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 max-w-4xl mx-auto w-full pointer-events-auto pb-2">
            {/* Film dots selector */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {films.map((film, i) => (
                <button
                  key={film.slug}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Select ${film.title}`}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-400 cursor-pointer ${
                    i === activeIndex
                      ? "w-8 sm:w-10 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                      : "w-2 sm:w-2.5 bg-white/25 hover:bg-white/50"
                  }`}
                  style={
                    i === activeIndex
                      ? { backgroundColor: film.palette.accent }
                      : undefined
                  }
                />
              ))}
            </div>

            {/* Center film Explore Link */}
            <Link
              href={`/films/${films[activeIndex].slug}`}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/25 bg-black/60 hover:bg-white hover:text-black text-white font-heading font-ethnocentric text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 shadow-xl backdrop-blur-md"
            >
              <span>Explore Film Treatment</span>
              <span>→</span>
            </Link>
          </div>

          {/* Subtle bottom gradient to merge into manifesto */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
        </div>

        {/* 1 ─ Smoke canvas */}
        <div
          ref={smokeLayerRef}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ transformOrigin: "center 38%" }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 88% 82% at 50% 50%, transparent 32%, rgba(5,5,5,0.72) 100%)",
            }}
          />
        </div>

        {/* 2 ─ Logo / Video center element */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none">
          {HERO_VIDEO_SRC ? (
            /* ── VIDEO MODE: fullscreen autoplay video runs ONCE (no loop) ── */
            <div
              ref={logoRef}
              className="opacity-0 absolute inset-0 bg-black"
              style={{ opacity: 0 }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-contain"
              >
                <source src="/video/s42-hero-h264.mp4" type="video/mp4" />
                <source src="/video/s42-hero.mp4" type="video/mp4" />
              </video>
              {/* Subtle vignette over the video */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 40%, rgba(5,5,5,0.65) 100%)",
                }}
              />
            </div>
          ) : (
            /* ── LOGO MODE: smoke animation + metallic logo (default) ── */
            <div
              ref={logoRef}
              className="opacity-0 flex flex-col items-center gap-5"
              style={{ opacity: 0 }}
            >
              <div className="relative flex flex-col items-center gap-5">
                {/* Logo with clean luminous presentation */}
                <div className="relative flex items-center justify-center">
                  {/* Soft cinematic ambient illumination behind the logo */}
                  <div
                    className="absolute inset-0 pointer-events-none -z-10"
                    style={{
                      background:
                        "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 45%, transparent 75%)",
                      transform: "scale(1.5)",
                    }}
                  />

                  {/* Full original metallic logo: zero cropping, 100% visible on all sides */}
                  <div className="relative w-[88vw] max-w-[360px] sm:max-w-[500px] md:max-w-[640px] lg:max-w-[760px] xl:max-w-[860px] aspect-[1024/358] flex items-center justify-center">
                    <Image
                      src="/images/brand/s42-films-official.png"
                      alt="S•42 FILMS"
                      fill
                      sizes="(max-width: 640px) 88vw, (max-width: 768px) 500px, (max-width: 1024px) 760px, 860px"
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
                {/* Divider + subtext positioned cleanly below the logo graphic */}
                <div className="flex flex-col items-center gap-3 mt-4 sm:mt-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <span className="block h-px w-16 sm:w-28 md:w-36 bg-gradient-to-r from-transparent to-[#f1f1ed]/38" />
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#f1f1ed]/60" />
                    <span className="block h-px w-16 sm:w-28 md:w-36 bg-gradient-to-l from-transparent to-[#f1f1ed]/38" />
                  </div>
                  <p className="font-heading font-ethnocentric text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#888885] whitespace-nowrap">
                    42 Great Stories Worth Remembering
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3 ─ Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-8 inset-x-0 z-30 flex flex-col items-center gap-2 opacity-0 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <p className="font-heading font-ethnocentric text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-[#777]">
            Scroll to Reveal
          </p>
          <div className="flex flex-col items-center gap-0.5 smoke-bounce-arrow">
            <span className="block w-px h-5 bg-gradient-to-b from-[#4a4a4a] to-transparent" />
            <span className="text-[#424242] text-xs leading-none">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
