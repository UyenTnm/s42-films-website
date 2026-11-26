import SmokeHero from "@/components/landing/SmokeHero";
import Manifesto from "@/components/landing/Manifesto";
import FilmPosterStrip from "@/components/landing/FilmPosterStrip";
import TalentCallout from "@/components/landing/TalentCallout";

export default function HomePage() {
  return (
    <>
      <SmokeHero />
      <Manifesto />
      <FilmPosterStrip />
      <TalentCallout />
      {/* <Footer /> */}
    </>
  );
}
