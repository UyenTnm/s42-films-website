import SmokeHero from "@/components/landing/SmokeHero";
import Manifesto from "@/components/landing/Manifesto";
import FilmIndex from "@/components/landing/FilmIndex";
import SignalSection from "@/components/landing/SignalSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <SmokeHero />
      <Manifesto />
      <FilmIndex />
      <SignalSection />
      <Footer />
    </>
  );
}
