"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/hooks/useLenis";

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
const HERO_VIDEO_SRC: string | null = "/video/s42-hero-v2.mp4";

// ══════════════════════════════════════════════════════════════
//  Component
// ══════════════════════════════════════════════════════════════
export default function SmokeHero() {
  const lenis = useLenis();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smokeLayerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);
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
          gsap.set(el.hint, { opacity: Math.max(0, 1 - p * 12) });
        },
      });
    }, el.wrapper!);

    return () => {
      entry.kill();
      ctx.revert();
    };
  }, []);

  const scrollToManifesto = () => {
    const target = document.querySelector<HTMLElement>("#manifesto");
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { offset: -72, duration: 1.35 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={wrapperRef} style={{ height: "100vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        <div
          ref={overlayRef}
          className="absolute inset-0 z-[999] bg-[#050505] pointer-events-none"
          style={{ opacity: 1 }}
        />

        {/* 0 ─ Smoke canvas */}
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

        {/* 1 ─ Logo / Video center element */}
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
                <source src="/video/s42-hero-v2-h264.mp4" type="video/mp4" />
                <source src={HERO_VIDEO_SRC} type="video/mp4" />
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

        {/* 2 ─ Scroll hint */}
        <button
          type="button"
          ref={hintRef}
          onClick={scrollToManifesto}
          aria-label="Go to the S•42 Promise"
          className="group absolute bottom-7 left-1/2 z-30 -translate-x-1/2 flex cursor-pointer flex-col items-center gap-2 opacity-0"
          style={{ opacity: 0 }}
        >
          <p className="font-heading font-ethnocentric text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-white/55 transition-colors group-hover:text-white/90">
            Discover S•42
          </p>
          <div className="smoke-bounce-arrow flex h-9 w-9 items-center justify-center rounded-full border border-white/18 bg-black/30 text-sm text-white/55 backdrop-blur-sm transition group-hover:border-white/55 group-hover:text-white">
            ↓
          </div>
        </button>
      </div>
    </div>
  );
}
