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
          <div className="relative z-30 flex flex-col items-center text-center gap-2 pt-3 sm:pt-5 pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="font-heading font-ethnocentric text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#f1f1ed]/80 bg-black/60 px-3.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
                FEATURED REVEAL // {films[activeIndex].number} OF 07
              </span>
            </div>

            {/* Official Film Title Logo Graphic */}
            <div className="relative h-12 sm:h-16 md:h-20 w-64 sm:w-80 md:w-[440px] my-1">
              <Image
                src={films[activeIndex].titleImage}
                alt={films[activeIndex].title}
                fill
                sizes="(max-width: 640px) 260px, 440px"
                className="object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
                priority
              />
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#b0b0a8] font-light max-w-xl line-clamp-1 italic">
              &ldquo;{films[activeIndex].tagline}&rdquo;
            </p>
          </div>

          {/* 3D Flowing Coverflow Stage */}
          <div className="relative w-full flex-1 flex items-center justify-center my-auto pointer-events-auto">
            {/* Left Prev Arrow Button */}
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + films.length) % films.length)
              }
              aria-label="Previous film"
              className="absolute left-2 sm:left-6 md:left-12 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-black border border-white/20 hover:border-white/70 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-md cursor-pointer group"
            >
              <span className="font-heading font-ethnocentric text-sm sm:text-base group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>
            </button>

            {/* Right Next Arrow Button */}
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % films.length)}
              aria-label="Next film"
              className="absolute right-2 sm:right-6 md:right-12 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-black border border-white/20 hover:border-white/70 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl backdrop-blur-md cursor-pointer group"
            >
              <span className="font-heading font-ethnocentric text-sm sm:text-base group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </button>

            {/* Carousel Track with 7 Posters */}
            <div className="relative flex items-center justify-center">
              {films.map((film, i) => {
                const n = films.length;
                let offset = (i - activeIndex) % n;
                if (offset > n / 2) offset -= n;
                if (offset < -n / 2) offset += n;
                const isCenter = offset === 0;
                const absOffset = Math.abs(offset);

                // Calculate 3D coverflow styling dynamically
                let scale = 1.15;
                let translateY = 0;
                let rotateY = 0;
                let opacity = 1;
                let zIndex = 30;

                if (absOffset === 1) {
                  scale = 0.92;
                  translateY = 14;
                  rotateY = offset * 5;
                  opacity = 0.88;
                  zIndex = 22;
                } else if (absOffset === 2) {
                  scale = 0.78;
                  translateY = 28;
                  rotateY = offset * 9;
                  opacity = 0.65;
                  zIndex = 16;
                } else if (absOffset >= 3) {
                  scale = 0.65;
                  translateY = 42;
                  rotateY = offset * 13;
                  opacity = 0.45;
                  zIndex = 10;
                }

                return (
                  <div
                    key={film.slug}
                    onClick={() => {
                      if (!isCenter) setActiveIndex(i);
                    }}
                    className={`relative cursor-pointer -mx-5 sm:-mx-8 md:-mx-12 lg:-mx-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isCenter ? "cursor-pointer" : "cursor-pointer"
                    }`}
                    style={{
                      transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotateY}deg)`,
                      transformOrigin: "bottom center",
                      zIndex,
                      opacity,
                    }}
                  >
                    {/* Ambient Backlit Glow for Active & Flanking Posters */}
                    <div
                      className={`absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-700 pointer-events-none ${
                        isCenter
                          ? "opacity-90 scale-105"
                          : "opacity-30 group-hover:opacity-60"
                      }`}
                      style={{ background: film.palette.accent }}
                    />

                    {/* Poster Card Container — BORDERLESS for seamless cinematic poster look */}
                    <Link
                      href={`/films/${film.slug}`}
                      onClick={(e) => {
                        if (!isCenter) {
                          e.preventDefault();
                          setActiveIndex(i);
                        }
                      }}
                      className={`relative block w-[170px] sm:w-[210px] md:w-[250px] lg:w-[285px] xl:w-[310px] aspect-[2/3] rounded-2xl overflow-hidden transition-all duration-500 bg-[#0d0d0d] ${
                        isCenter
                          ? "shadow-[0_40px_100px_rgba(0,0,0,0.98)] ring-1 ring-white/10"
                          : "shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                      }`}
                    >
                      {/* High-Resolution Poster Image */}
                      <Image
                        src={film.posterImage}
                        alt={film.title}
                        fill
                        sizes="(max-width: 640px) 180px, (max-width: 1024px) 260px, 320px"
                        className={`object-cover transition-transform duration-700 ${
                          isCenter
                            ? "brightness-110 contrast-105 scale-100"
                            : "brightness-95 hover:brightness-105"
                        }`}
                        priority
                      />

                      {/* Subtle Bottom Scrim for Title Legibility */}
                      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                      {/* Film Number Badge */}
                      <span
                        className="absolute top-3 left-3 font-heading font-ethnocentric text-[9px] sm:text-[10px] tracking-widest px-2 py-0.5 rounded font-bold shadow-lg bg-black/70 backdrop-blur-md"
                        style={{
                          color: film.palette.accent,
                        }}
                      >
                        {film.number}
                      </span>

                      {/* Official Film Title Graphic on Poster */}
                      <div className="absolute bottom-2 inset-x-0 px-3 flex justify-center pointer-events-none">
                        <div className="relative h-8 sm:h-10 w-full max-w-[200px]">
                          <Image
                            src={film.titleImage}
                            alt={film.title}
                            fill
                            className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                          />
                        </div>
                      </div>
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
              className="opacity-0 absolute inset-0"
              style={{ opacity: 0 }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
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
