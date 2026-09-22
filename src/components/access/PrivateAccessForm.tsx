"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface PrivateAccessFormProps {
  destination: string;
  initialMessage?: string;
}

export default function PrivateAccessForm({
  destination,
  initialMessage = "",
}: PrivateAccessFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const code = String(formData.get("access-code") || "");
    if (!code.trim()) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        setMessage(result.message || "Access could not be verified.");
        form.reset();
        inputRef.current?.focus();
        return;
      }

      router.replace(destination);
      router.refresh();
    } catch {
      setMessage("Access could not be verified. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="private-access relative isolate min-h-svh overflow-hidden bg-black text-[#f1f1ed]">
      <video
        className="absolute inset-0 -z-30 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/video/s42-hero-h264.mp4" type="video/mp4" />
        <source src="/video/s42-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 -z-20 bg-black/45" />
      <div className="private-access-vignette absolute inset-0 -z-10" />
      <div className="private-access-grain absolute inset-0 -z-10 opacity-[0.055]" />

      <div className="flex min-h-svh items-center justify-center px-6 py-6 sm:px-10 md:px-14">
        <section className="flex w-full max-w-3xl flex-col items-center border border-white/12 bg-black/55 px-6 py-[clamp(1.5rem,5svh,3.5rem)] text-center shadow-[0_40px_140px_rgba(0,0,0,0.88)] backdrop-blur-[10px] sm:px-12 md:px-16">
          <div className="relative mb-[clamp(1rem,3svh,2rem)] h-[clamp(5.5rem,15svh,9rem)] w-[clamp(15rem,42svh,24rem)]">
            <Image
              src="/images/brand/s42-films-official.png"
              alt="S•42 Films"
              fill
              sizes="384px"
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          <h1 className="whitespace-nowrap font-heading text-[clamp(1.65rem,7vw,2.4rem)] leading-none tracking-[0.055em] uppercase">
            Private Access
          </h1>
          <p className="mt-[clamp(1rem,2.5svh,1.5rem)] max-w-md text-sm leading-relaxed font-light text-white/68 sm:text-base">
            Enter the access code to preview the S•42 slate and confidential
            film-development materials.
          </p>

          <form
            onSubmit={handleSubmit}
            action="/api/access"
            method="post"
            className="mt-[clamp(1.5rem,4svh,2.5rem)] flex w-full max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input type="hidden" name="next" value={destination} />
            <label className="sr-only" htmlFor="access-code">
              Access code
            </label>
            <input
              ref={inputRef}
              id="access-code"
              name="access-code"
              type="password"
              autoComplete="current-password"
              onChange={() => {
                if (message) setMessage("");
              }}
              placeholder="ACCESS CODE"
              className="h-14 w-full min-w-0 border border-white/30 bg-black/35 px-5 font-heading text-xs tracking-[0.2em] text-white uppercase outline-none backdrop-blur-md transition placeholder:text-white/38 focus:border-white/75 focus:bg-black/50 sm:flex-1"
              aria-describedby="access-status"
              autoFocus
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex h-14 min-w-44 cursor-pointer items-center justify-between gap-8 border border-white bg-white px-5 font-heading text-[10px] tracking-[0.2em] text-black uppercase transition hover:bg-transparent hover:text-white disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-white/10 disabled:text-white/35 sm:text-xs"
            >
              <span>{isSubmitting ? "Verifying" : "Enter S•42"}</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>

          <p
            id="access-status"
            className="mt-4 min-h-5 text-xs tracking-wide text-[#ffb4ad]"
            aria-live="polite"
          >
            {message}
          </p>
        </section>
      </div>
    </main>
  );
}
