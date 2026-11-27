"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import gsap from "gsap";

const pillars = [
  {
    title: "CREATIVE POWER.",
    description:
      "Extraordinary stories. Original characters. Immersive worlds. Limitless imagination.",
    image: "/images/manifesto/creative-power.png",
    imageAlt:
      "A lone figure overlooking an expansive cinematic world blending nature and a futuristic city",
  },
  {
    title: "TECHNICAL POWER.",
    description:
      "Advanced AIGC. Intelligent production. Digital world building. Interactive entertainment.",
    image: "/images/manifesto/technical-power.png",
    imageAlt:
      "A cinematic character portrait transitioning into a digital wireframe world",
  },
] as const;

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAPContext(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.utils
        .toArray<HTMLElement>(".manifesto-reveal")
        .forEach((element) => {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: 52,
              scale: 0.975,
              filter: "blur(14px)",
              clipPath: "inset(12% 0% 0% 0%)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.15,
              ease: "power4.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

      gsap.fromTo(
        ".manifesto-visual img",
        { scale: 1.045 },
        {
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".manifesto-pillars",
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".manifesto-ambient-42",
        { yPercent: -8 },
        {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.3,
          },
        },
      );
    },
    sectionRef,
    []
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      aria-label="About"
      className="relative overflow-hidden bg-[#060606] px-6 pb-24 pt-12 sm:px-10 sm:pb-32 sm:pt-16 md:px-16 md:pb-40 md:pt-20 lg:px-20 lg:pb-44 lg:pt-20"
    >
      <div className="pointer-events-none absolute left-1/2 top-[43%] -z-0 -translate-x-1/2 -translate-y-1/2 select-none">
        <span className="manifesto-ambient-42 block font-heading font-ethnocentric text-[190px] font-black leading-none tracking-tighter text-white/[0.018] sm:text-[300px] md:text-[420px] lg:text-[520px]">
          42
        </span>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-[28%] h-[560px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.12) 0%, rgba(255,255,255,0.07) 38%, transparent 72%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <div className="manifesto-reveal pb-6 text-center">
          <p className="font-heading font-ethnocentric text-[9px] uppercase tracking-[0.24em] text-[#b38a43] sm:text-[10px]">
            About
          </p>
          <Image
            src="/images/brand/s42-wordmark.png"
            alt="S•42 Films"
            width={1050}
            height={359}
            className="mx-auto mb-7 mt-4 h-auto w-[132px] object-contain sm:mb-8 sm:mt-5 sm:w-[160px]"
          />
          <span
            className="inline-block bg-clip-text font-heading font-ethnocentric text-[clamp(0.95rem,1.9vw,1.9rem)] leading-[1.3] tracking-[0.12em] text-transparent [filter:drop-shadow(0_2px_14px_rgba(222,225,230,0.14))]"
            style={{
              backgroundImage:
                "linear-gradient(112deg, #74777d 0%, #f4f5f6 28%, #a8abb0 52%, #ffffff 72%, #73767b 100%)",
              WebkitBackgroundClip: "text",
            }}
          >
            AI-NATIVE ENTERTAINMENT &amp; TECHNOLOGY
          </span>
        </div>

        <div className="manifesto-reveal mx-auto max-w-6xl pb-16 pt-14 text-center sm:pb-20 sm:pt-20 md:pb-24 md:pt-24">
          <h2
            className="whitespace-nowrap bg-clip-text font-heading font-ethnocentric text-[clamp(1.15rem,4.5vw,4.1rem)] leading-none tracking-[0.015em] text-transparent [filter:drop-shadow(0_5px_24px_rgba(201,168,76,0.16))]"
            style={{
              backgroundImage:
                "linear-gradient(112deg, #6d4b1e 0%, #f2d48b 28%, #a87428 52%, #fff0b5 72%, #76501e 100%)",
              WebkitBackgroundClip: "text",
            }}
          >
            FORTY-TWO WORLDS.
          </h2>
          <p
            className="mt-6 font-sans text-xl font-light italic leading-tight tracking-[-0.01em] text-[#aaa9a3] sm:mt-8 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Infinite Possibilities. One Enduring Legacy.
          </p>
          <p
            className="mx-auto mt-8 max-w-4xl font-sans text-base font-light leading-relaxed tracking-[0.01em] text-[#8e8e88] sm:mt-10 sm:text-lg md:text-xl lg:text-2xl lg:leading-relaxed"
          >
            One extraordinary commitment: to create forty-two original worlds
            with uncompromising creative ambition and technological excellence.
          </p>
        </div>

        <div className="manifesto-pillars grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-7">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="manifesto-reveal group flex h-full flex-col overflow-hidden border border-white/[0.09] bg-[#090909]"
            >
              <div className="manifesto-visual relative aspect-[16/9] overflow-hidden bg-[#0b0b0b]">
                <Image
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1439px) 50vw, 700px"
                  className="object-cover saturate-[0.78] contrast-[1.08] brightness-[0.72] transition-[filter,transform] duration-1000 ease-out group-hover:saturate-100 group-hover:brightness-[0.82]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-black/10 to-black/20" />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(201,168,76,0.07),transparent_46%)]" />
              </div>

              <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-7 text-center sm:px-8 sm:pb-10 sm:pt-8 lg:px-10 lg:pb-12 lg:pt-10">
                <h3
                  className="bg-clip-text font-heading font-ethnocentric text-xl leading-tight tracking-[0.06em] text-transparent [filter:drop-shadow(0_4px_18px_rgba(201,168,76,0.14))] sm:text-2xl lg:text-3xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(112deg, #765220 0%, #efd087 32%, #b27e2e 58%, #f8e1a3 78%, #79531f 100%)",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="mt-5 max-w-xl font-sans text-base font-light leading-relaxed tracking-[0.01em] text-[#969690] sm:text-lg lg:text-xl lg:leading-relaxed"
                >
                  {pillar.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
