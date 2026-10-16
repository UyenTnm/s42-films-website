"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface PrivateAccessFormProps {
  destination: string;
}

type Step = "email" | "code";
type Status = { tone: "error" | "info"; text: string } | null;

const RESEND_COOLDOWN_SECONDS = 30;
const CODE_LENGTH = 6;

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    message?: string;
  };

  return { ok: response.ok && Boolean(result.ok), message: result.message };
}

export default function PrivateAccessForm({
  destination,
}: PrivateAccessFormProps) {
  const router = useRouter();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("email");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(
      () => setCooldown((value) => value - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
    else firstNameRef.current?.focus();
  }, [step]);

  const requestCode = async (isResend = false) => {
    setIsSubmitting(true);
    setStatus(null);

    try {
      const result = await postJson("/api/access/request", {
        firstName,
        lastName,
        company,
        email,
      });

      if (!result.ok) {
        setStatus({
          tone: "error",
          text:
            result.message || "We could not send the code. Please try again.",
        });
        return false;
      }

      setCooldown(RESEND_COOLDOWN_SECONDS);
      if (isResend) {
        setStatus({ tone: "info", text: "A new code is on its way." });
      }
      return true;
    } catch {
      setStatus({
        tone: "error",
        text: "We could not send the code. Please try again.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmitDetails = [firstName, lastName, company, email].every(
    (value) => value.trim().length > 0,
  );

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!canSubmitDetails) return;

    const sent = await requestCode();
    if (sent) {
      setCode("");
      setStep("code");
    }
  };

  const verifyCode = async (value: string) => {
    if (isSubmitting || value.length !== CODE_LENGTH) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const result = await postJson("/api/access/verify", { code: value });

      if (!result.ok) {
        setStatus({
          tone: "error",
          text: result.message || "That code is not valid. Please try again.",
        });
        setCode("");
        codeRef.current?.focus();
        return;
      }

      router.replace(destination);
      router.refresh();
    } catch {
      setStatus({
        tone: "error",
        text: "We could not verify the code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void verifyCode(code);
  };

  const handleCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
    if (status) setStatus(null);
    if (digits.length === CODE_LENGTH) void verifyCode(digits);
  };

  const goBackToEmail = () => {
    setStep("email");
    setCode("");
    setStatus(null);
  };

  const inputClasses =
    "h-14 w-full min-w-0 border border-white/30 bg-black/35 px-5 text-white outline-none backdrop-blur-md transition placeholder:text-white/38 focus:border-white/75 focus:bg-black/50";
  const buttonClasses =
    "group relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden border border-[#a3a3a3] bg-[#a3a3a3] px-8 font-heading text-[10px] tracking-[0.2em] text-black uppercase transition-colors hover:border-[#f1f1ed] disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-white/10 disabled:text-white/35 sm:text-xs";

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
        <source src="/video/s42-hero-v2-h264.mp4" type="video/mp4" />
        <source src="/video/s42-hero-v2.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 -z-20 bg-black/45" />
      <div className="private-access-vignette absolute inset-0 -z-10" />
      <div className="private-access-grain absolute inset-0 -z-10 opacity-[0.055]" />

      <div className="flex min-h-svh items-center justify-center px-6 py-6 sm:px-10 md:px-14">
        {/* <section className="flex w-full max-w-3xl flex-col items-center border border-white/12 bg-black/55 px-6 py-[clamp(1.5rem,5svh,3.5rem)] text-center shadow-[0_40px_140px_rgba(0,0,0,0.88)] backdrop-blur-[10px] sm:px-12 md:px-16"> */}
        <section className="flex w-full max-w-3xl flex-col items-center border border-white/12 bg-black/55 px-4 py-[clamp(1.5rem,5svh,3.5rem)] text-center shadow-[0_40px_140px_rgba(0,0,0,0.88)] backdrop-blur-[10px] sm:px-12 md:px-16">
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

          <p className="mb-3 font-heading text-[10px] tracking-[0.3em] text-white/45 uppercase">
            Step {step === "email" ? "1" : "2"} of 2
          </p>

          {/* <h1 className="whitespace-nowrap font-heading text-[clamp(1.65rem,7vw,2.4rem)] leading-none tracking-[0.055em] uppercase"> */}
          <h1 className="whitespace-nowrap font-heading text-[clamp(0.95rem,calc((100vw-6.5rem)/14.8),2.4rem)] sm:text-[clamp(0.95rem,calc((100vw-11.1rem)/15.5),2.4rem)] md:text-[clamp(0.95rem,calc((100vw-15.2rem)/15.5),2.4rem)] min-[880px]:text-[2.4rem] leading-none tracking-[0.055em] uppercase">
            {step === "email" ? "Private Access" : "Check Your Email"}
          </h1>

          {step === "email" ? (
            <>
              <p className="mt-[clamp(1rem,2.5svh,1.5rem)] max-w-md text-sm leading-relaxed font-light text-white/68 sm:text-base">
                Tell us who you are and we will email you a one-time code to
                preview the S•42 slate and confidential film-development
                materials.
              </p>

              <form
                onSubmit={handleEmailSubmit}
                className="mt-[clamp(1.5rem,4svh,2.5rem)] flex w-full max-w-lg flex-col gap-3"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="access-first-name">
                      First name
                    </label>
                    <input
                      ref={firstNameRef}
                      id="access-first-name"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(event) => {
                        setFirstName(event.target.value);
                        if (status) setStatus(null);
                      }}
                      placeholder="FIRST NAME"
                      className={`${inputClasses} text-center font-heading text-xs tracking-[0.2em] uppercase`}
                      aria-describedby="access-status"
                      maxLength={60}
                      required
                    />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="access-last-name">
                      Last name
                    </label>
                    <input
                      id="access-last-name"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(event) => {
                        setLastName(event.target.value);
                        if (status) setStatus(null);
                      }}
                      placeholder="LAST NAME"
                      className={`${inputClasses} text-center font-heading text-xs tracking-[0.2em] uppercase`}
                      aria-describedby="access-status"
                      maxLength={60}
                      required
                    />
                  </div>
                </div>

                <label className="sr-only" htmlFor="access-company">
                  Company name
                </label>
                <input
                  id="access-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={company}
                  onChange={(event) => {
                    setCompany(event.target.value);
                    if (status) setStatus(null);
                  }}
                  placeholder="COMPANY NAME"
                  className={`${inputClasses} text-center font-heading text-xs tracking-[0.2em] uppercase`}
                  aria-describedby="access-status"
                  maxLength={100}
                  required
                />

                <label className="sr-only" htmlFor="access-email">
                  Email address
                </label>
                <input
                  id="access-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status) setStatus(null);
                  }}
                  placeholder="YOUR@EMAIL.COM"
                  className={`${inputClasses} text-center font-heading text-xs tracking-[0.2em] uppercase`}
                  aria-describedby="access-status"
                  maxLength={254}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmitDetails}
                  className={buttonClasses}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 origin-left bg-[#f1f1ed] transition-transform ease-out group-disabled:hidden ${
                      isSubmitting
                        ? "scale-x-100 duration-[1800ms]"
                        : "scale-x-0 duration-500 group-hover:scale-x-100"
                    }`}
                  />
                  <span className="relative pl-[0.2em]">
                    {isSubmitting ? "Sending" : "Send Code"}
                  </span>
                </button>
              </form>

              <p className="mt-5 max-w-md text-[12px] leading-relaxed text-white">
                By continuing you agree to keep all materials confidential and
                not to copy, record or share them. You also agree to receive
                occasional updates about S•42 Films at this address, and can
                unsubscribe at any time.
              </p>
            </>
          ) : (
            <>
              <p className="mt-[clamp(1rem,2.5svh,1.5rem)] max-w-md text-sm leading-relaxed font-light text-white/68 sm:text-base">
                We sent a 6-digit code to{" "}
                <span className="break-all font-normal text-white">
                  {email}
                </span>
                .{" "}
                <span className="whitespace-nowrap">
                  It expires in 10 minutes.
                </span>
              </p>

              <form
                onSubmit={handleCodeSubmit}
                className="mt-[clamp(1.5rem,4svh,2.5rem)] flex w-full max-w-lg flex-col gap-3"
              >
                <label className="sr-only" htmlFor="access-code">
                  6-digit code
                </label>
                <input
                  ref={codeRef}
                  id="access-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  value={code}
                  onChange={(event) => handleCodeChange(event.target.value)}
                  placeholder="······"
                  className={`${inputClasses} text-center font-heading text-2xl tracking-[0.6em] indent-[0.6em]`}
                  aria-describedby="access-status"
                  maxLength={CODE_LENGTH}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || code.length !== CODE_LENGTH}
                  className={buttonClasses}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 origin-left bg-[#f1f1ed] transition-transform ease-out group-disabled:hidden ${
                      isSubmitting
                        ? "scale-x-100 duration-[1800ms]"
                        : "scale-x-0 duration-500 group-hover:scale-x-100"
                    }`}
                  />
                  <span className="relative pl-[0.2em]">
                    {isSubmitting ? "Verifying" : "Enter S•42"}
                  </span>
                </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-heading text-[10px] tracking-[0.2em] uppercase">
                <button
                  type="button"
                  onClick={goBackToEmail}
                  className="cursor-pointer text-white/55 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Edit your details
                </button>
                <button
                  type="button"
                  onClick={() => void requestCode(true)}
                  disabled={isSubmitting || cooldown > 0}
                  className="cursor-pointer text-white/55 underline-offset-4 transition hover:text-white hover:underline disabled:cursor-not-allowed disabled:text-white/25 disabled:no-underline"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </>
          )}

          <p
            id="access-status"
            className={`mt-4 min-h-5 text-xs tracking-wide ${
              status?.tone === "info" ? "text-white/70" : "text-[#ffb4ad]"
            }`}
            aria-live="polite"
          >
            {status?.text}
          </p>
        </section>
      </div>
    </main>
  );
}
