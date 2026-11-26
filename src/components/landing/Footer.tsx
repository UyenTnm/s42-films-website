"use client";

import {
  faFacebookF,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useLenis } from "@/hooks/useLenis";
import { usePathname } from "next/navigation";

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function Footer() {
  const lenis = useLenis();
  const pathname = usePathname();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (pathname === "/access") return null;

  return (
    <footer className="relative overflow-hidden bg-[#050505] px-6 pb-12 pt-16 text-[#898989] md:px-16 md:pb-14 md:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-180px] left-1/2 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] items-end gap-10 text-center font-sans text-xs font-light md:grid-cols-[1fr_auto_1fr] md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="relative h-10 w-28">
            <Image
              src="/images/brand/s42-films-official.png"
              alt="S•42 FILMS"
              fill
              sizes="120px"
              className="object-contain object-left"
              unoptimized
            />
          </div>
          <p className="text-[#666]">42 great stories worth remembering.</p>
        </div>

        <div className="flex flex-col items-center gap-5 text-center text-[#555]">
          <nav
            aria-label="S•42 Films social media"
            className="flex items-center justify-center gap-3"
          >
            <a
              href="https://www.facebook.com/s42films/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="S•42 Films on Facebook"
              title="Facebook"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-[#898989] transition-colors hover:border-white/30 hover:text-white"
            >
              <FontAwesomeIcon icon={faFacebookF} className="size-4" />
            </a>
            <a
              href="https://www.instagram.com/s42films/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="S•42 Films on Instagram"
              title="Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-[#898989] transition-colors hover:border-white/30 hover:text-white"
            >
              <FontAwesomeIcon icon={faInstagram} className="size-4" />
            </a>
            <a
              href="https://www.youtube.com/@S42FILMSAdmin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="S•42 Films on YouTube"
              title="YouTube"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-[#898989] transition-colors hover:border-white/30 hover:text-white"
            >
              <FontAwesomeIcon icon={faYoutube} className="size-4" />
            </a>
          </nav>
          <address
            aria-label="Contact S•42 Films"
            className="flex flex-col items-center gap-2 not-italic sm:flex-row sm:gap-6"
          >
            <a
              href="mailto:hello@s42films.com"
              className="flex items-center gap-2.5 text-[#898989] transition-colors hover:text-white"
            >
              <MailIcon />
              <span>hello@s42films.com</span>
            </a>
            <a
              href="https://wa.me/16479806279"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with S•42 Films on WhatsApp"
              className="flex items-center gap-2.5 text-[#898989] transition-colors hover:text-white"
            >
              <PhoneIcon />
              <span>+1.647.980.6279</span>
            </a>
          </address>
          <span>© S•42 FILMS. ALL RIGHTS RESERVED.</span>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="group mx-auto inline-flex cursor-pointer items-center gap-3 font-heading font-ethnocentric text-[10px] uppercase tracking-[0.12em] text-[#898989] transition-colors hover:text-white md:mx-0 md:ml-auto"
        >
          <span>Back To Top</span>
          <span className="transition-transform duration-300 group-hover:-translate-y-1">
            ↑
          </span>
        </button>
      </div>
    </footer>
  );
}
