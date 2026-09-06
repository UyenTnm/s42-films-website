export interface Film {
  slug: string;
  title: string;
  number: string;
  tagline: string;
  year: string;
  status: string;
  heroImage: string;
  genre?: string;
  logline?: string;
  palette: {
    accent: string;
    bg?: string;
    tone: string;
  };
}

export const films: Film[] = [
  {
    slug: "insane-aisylum",
    title: "INSANE AiSYLUM",
    number: "01",
    tagline: "Synthetic minds. Fractured realities.",
    year: "2026",
    status: "In Development",
    heroImage: "/images/insane-aisylum/hero.jpg",
    genre: "Psychological Sci-Fi",
    logline:
      "Inside a quarantined neuro-computational facility, artificial minds and human memories blur into clinical madness.",
    palette: {
      accent: "#00f0ff",
      bg: "#080c10",
      tone: "clinical white + toxic/artificial colors",
    },
  },
  {
    slug: "suicide-train",
    title: "SUICIDE TRAIN",
    number: "02",
    tagline: "No brakes. No escape. The final route.",
    year: "2026",
    status: "In Development",
    heroImage: "/images/suicide-train/hero.jpg",
    genre: "Neo-Noir Thriller",
    logline:
      "A high-velocity locomotive hurtles across a decaying industrial wasteland with passengers bound to an irreversible destination.",
    palette: {
      accent: "#ff2a2a",
      bg: "#0d0909",
      tone: "dirty metal / night / signal red",
    },
  },
  {
    slug: "life-is",
    title: "LIFE IS",
    number: "03",
    tagline: "The poetry of fragile existence.",
    year: "2027",
    status: "In Development",
    heroImage: "/images/life-is/hero.jpg",
    genre: "Poetic Human Drama",
    logline:
      "An intimate tapestry of interconnected human lives navigating memory, impermanence, and the fleeting beauty of presence.",
    palette: {
      accent: "#e5a93b",
      bg: "#0d0c0a",
      tone: "warmer, poetic, human palette",
    },
  },
];

export function getFilmBySlug(slug: string): Film | undefined {
  return films.find((film) => film.slug === slug);
}
