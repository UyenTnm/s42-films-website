import EntrySequence from "@/components/landing/EntrySequence";
import Hero from "@/components/landing/Hero";
import Manifesto from "@/components/landing/Manifesto";
import FilmIndex from "@/components/landing/FilmIndex";
import SignalSection from "@/components/landing/SignalSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <EntrySequence />
      <Hero />
      <Manifesto />
      <FilmIndex />
      <SignalSection />
      <Footer />
    </>
  );
}
