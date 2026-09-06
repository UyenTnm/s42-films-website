import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Header from "@/components/navigation/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S•42 — 42 Great Stories Worth Remembering",
  description:
    "An independent cinematic house producing forty-two seminal films across sci-fi, neo-noir, and human drama.",
  keywords: ["S•42", "S42 Films", "Cinema", "Insane AiSylum", "Suicide Train", "Life Is"],
  openGraph: {
    title: "S•42 — 42 Great Stories Worth Remembering",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f1f1ed] selection:bg-[#f1f1ed] selection:text-[#050505]">
        <SmoothScroll>
          <Header />
          <main className="flex-1 pt-20">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
