import type { Metadata } from "next";
import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Header from "@/components/navigation/Header";
import "./globals.css";

const ethnocentric = localFont({
  src: "../../public/fonts/FC-Ethnocentric-Rg.otf",
  variable: "--font-ethnocentric",
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "S•42 — 42 Great Stories Worth Remembering",
  description:
    "An independent cinematic house producing forty-two seminal films across sci-fi, neo-noir, and human drama.",
  keywords: [
    "S•42",
    "S42 Films",
    "Cinema",
    "Insane AiSylum",
    "Suicide Train",
    "Life Is",
  ],
  openGraph: {
    title: "S•42 Films",
    description:
      "An independent cinematic house producing forty-two seminal films.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ethnocentric.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f1f1ed] selection:bg-[#f1f1ed] selection:text-[#050505] font-sans">
        <SmoothScroll>
          <Header />
          <main className="flex-1">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
