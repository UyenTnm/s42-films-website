"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { films } from "@/data/films";

// Register GSAP plugins on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────
// Perlin-style turbulence noise for the smoke
// Seeded from a simple permutation table
// ─────────────────────────────────────────────
function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}
function grad(hash: number, x: number, y: number) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

const P: number[] = [];
(function buildPermTable() {
  const src = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [src[i], src[j]] = [src[j], src[i]];
  }
  for (let i = 0; i < 512; i++) P[i] = src[i & 255];
})();

function noise2D(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const a = P[X] + Y;
  const b = P[X + 1] + Y;
  return lerp(
    lerp(grad(P[a], xf, yf), grad(P[b], xf - 1, yf), u),
    lerp(grad(P[a + 1], xf, yf - 1), grad(P[b + 1], xf - 1, yf - 1), u),
    v
  );
}

// Fractal Brownian Motion — gives the "wispy organic" feel
function fbm(x: number, y: number, octaves = 5): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1.0;
  for (let i = 0; i < octaves; i++) {
    val += noise2D(x * freq, y * freq) * amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return val;
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function SmokeHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const smokeLayerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);
  const postersRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const globalOpacityRef = useRef<number>(1);

  // ── Canvas smoke render loop ──────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function drawSmoke(t: number) {
      if (!canvas || !ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      const globalAlpha = globalOpacityRef.current;

      ctx.clearRect(0, 0, W, H);

      if (globalAlpha <= 0.005) return;

      // Resolution scale — lower = cheaper but still gorgeous
      const scale = Math.max(1, Math.floor(window.devicePixelRatio));
      const stepX = Math.ceil(W / 160);
      const stepY = Math.ceil(H / 110);

      const imageData = ctx.createImageData(W, H);
      const data = imageData.data;

      const slowT = t * 0.00008;
      const driftX = slowT * 0.3;
      const driftY = slowT * 0.12;

      for (let py = 0; py < H; py += stepY) {
        for (let px = 0; px < W; px += stepX) {
          // UV from 0..1, with slight distortion for the "billow"
          const u = px / W;
          const v = py / H;

          // Double-domain warp — gives the churning cloud look
          const warpX = fbm(u * 2.4 + driftX, v * 2.4 + driftY + 1.7, 4) * 0.6;
          const warpY = fbm(u * 2.4 + driftX + 3.2, v * 2.4 + driftY, 4) * 0.6;

          const n = fbm(u * 3.0 + warpX + driftX, v * 3.0 + warpY + driftY, 5);

          // Map noise to smoke density: push below 0 → transparent, above → bright
          const density = Math.max(0, n * 1.8 + 0.05);

          // Vignette: edges fade away
          const edgeDist = Math.min(u, 1 - u, v, 1 - v) * 4;
          const vignette = Math.min(1, edgeDist);

          // Color: off-white cold smoke (#e8e8e0 range → tinted grey-blue)
          const raw = Math.min(1, density * vignette);
          const smoke = raw * raw; // gamma-compress for depth

          // Smoke tint palette: cold pale white → slightly blue
          const r = 220 + smoke * 30;
          const g = 220 + smoke * 30;
          const b = 230 + smoke * 20;
          const a = smoke * 0.78 * globalAlpha;

          // Fill block pixels (cheaper than per-pixel)
          for (let dy = 0; dy < stepY && py + dy < H; dy++) {
            for (let dx = 0; dx < stepX && px + dx < W; dx++) {
              const idx = ((py + dy) * W + (px + dx)) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = a * 255;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      void scale;
    }

    function tick(timestamp: number) {
      timeRef.current = timestamp;
      drawSmoke(timestamp);
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    rafRef.current = animId;

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── GSAP scroll-triggered dissolve ───────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const smokeLayer = smokeLayerRef.current;
    const logo = logoRef.current;
    const overlayText = overlayTextRef.current;
    const posters = postersRef.current;

    if (!wrapper || !smokeLayer || !logo || !overlayText || !posters) return;

    const ctx = gsap.context(() => {
      // Entry: logo drifts up, overlay text fades in
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(logo, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.4, ease: "power4.out" })
        .fromTo(overlayText, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }, "-=0.7");

      // Scroll: smoke dissolves — ScrollTrigger scrubs globalOpacityRef and CSS opacity
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "70% top",
        scrub: 1.2,
        onUpdate: (self) => {
          // Drive canvas opacity via ref (picked up by render loop)
          globalOpacityRef.current = 1 - self.progress;

          // GSAP-control the smoke layer DOM opacity for blending
          gsap.set(smokeLayer, { opacity: 1 - self.progress });

          // Posters reveal — counter-fade
          const posterProgress = Math.max(0, (self.progress - 0.25) / 0.75);
          gsap.set(posters, { opacity: posterProgress });
        },
      });

      // Smoke layer: also translate up slightly as it dissolves (blown-away)
      gsap.to(smokeLayer, {
        y: "-12%",
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "70% top",
          scrub: 1.5,
        },
      });

      // Logo: pin on dissolve, then slide up
      gsap.to(logo, {
        y: "-30%",
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "15% top",
          end: "55% top",
          scrub: 1,
        },
      });

      // Poster cards stagger reveal
      gsap.fromTo(
        ".smoke-poster-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: posters,
            start: "top 80%",
          },
        }
      );
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    // Tall wrapper creates the scroll distance for the dissolve
    <div ref={wrapperRef} className="relative" style={{ height: "250vh" }}>
      {/* ── Sticky container — stays fixed during scroll ── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]"
      >
        {/* ─── Poster Grid — revealed from behind smoke ─── */}
        <div
          ref={postersRef}
          className="absolute inset-0 z-10 opacity-0"
        >
          {/* Ambient dark atmosphere */}
          <div className="absolute inset-0 bg-[#050505]/60 z-10" />

          {/* Posters — 3-column spread with depth offsets */}
          <div className="absolute inset-0 flex items-end justify-center gap-0 px-8 pb-0 z-20">
            {films.map((film, i) => {
              const offsets = ["translate-y-12", "translate-y-0", "translate-y-20"];
              const scales = ["scale-[0.88]", "scale-100", "scale-[0.84]"];
              const rotations = ["-rotate-2", "rotate-0", "rotate-1"];
              return (
                <div
                  key={film.slug}
                  className={`smoke-poster-card relative flex-1 max-w-[340px] aspect-[2/3] ${offsets[i]} ${scales[i]} ${rotations[i]} origin-bottom`}
                >
                  {/* Poster glow */}
                  <div
                    className="absolute -inset-4 rounded-2xl blur-3xl opacity-30"
                    style={{ backgroundColor: film.palette.accent }}
                  />
                  <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    <Image
                      src={film.posterImage}
                      alt={film.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      priority={i === 1}
                    />
                    {/* Poster gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {/* Film number badge */}
                    <div
                      className="absolute top-3 left-3 font-mono text-[10px] tracking-widest px-2 py-1 rounded border"
                      style={{ color: film.palette.accent, borderColor: film.palette.accent }}
                    >
                      {film.number}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom gradient to merge with content below */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050505] to-transparent z-30" />
        </div>

        {/* ─── Smoke Layer ─── */}
        <div
          ref={smokeLayerRef}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          {/* The turbulence canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ mixBlendMode: "screen" }}
          />

          {/* Radial dark core so smoke reads against the bg */}
          <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-[#050505]/30 to-[#050505]/60" />
        </div>

        {/* ─── Logo + Hero Text overlay (above smoke) ─── */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          {/* Logo */}
          <div ref={logoRef} className="flex flex-col items-center gap-6 opacity-0">
            <div className="relative w-56 h-20 sm:w-72 sm:h-24 md:w-80 md:h-28">
              <Image
                src="/images/brand/logo.png"
                alt="S•42 FILMS"
                fill
                sizes="320px"
                className="object-contain"
                priority
              />
            </div>

            {/* Tagline */}
            <div
              ref={overlayTextRef}
              className="text-center space-y-2 opacity-0"
            >
              <p className="font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#898989]">
                42 Great Stories Worth Remembering
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-[#f1f1ed]/20" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#f1f1ed]/40 animate-pulse" />
                <span className="h-px w-12 bg-[#f1f1ed]/20" />
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 flex flex-col items-center gap-2 pointer-events-auto">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#555]">
              Scroll to Reveal
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-[#555] to-transparent animate-pulse" />
          </div>
        </div>

        {/* ─── Content visible AFTER smoke dissolves ─── */}
        <div className="absolute bottom-0 left-0 right-0 z-40 px-6 md:px-16 pb-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            {/* Left: section label */}
            <div className="font-mono text-[11px] tracking-widest uppercase text-[#898989]">
              <span className="text-[#f1f1ed]">01 //</span> Active Film Roster
            </div>

            {/* Right: CTA */}
            <Link
              href="#films"
              className="group inline-flex items-center gap-3 px-5 py-2.5 rounded border border-[#f1f1ed]/20 bg-[#050505]/80 backdrop-blur hover:bg-[#f1f1ed] hover:text-[#050505] text-[#f1f1ed] transition-all duration-300 font-mono text-xs tracking-widest uppercase"
            >
              <span>View 3 Film Projects</span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">↓</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
