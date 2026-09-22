export interface Film {
  slug: string;
  title: string;
  titleImage: string;
  titleImageOneLine?: string;
  number: string;
  subtitle?: string;
  tagline: string;
  creator: string;
  format?: string;
  setting?: string;
  genre: string;
  logline: string;
  pitch?: string;
  posterImage: string;
  heroImage: string;
  palette: {
    accent: string;
    bg: string;
  };
  details?: {
    stats?: { label: string; value: string }[];
    audiencePromise?: string;
    emotionalEngine?: string;
    proposition?: string;
    fourFilms?: {
      title: string;
      tagline: string;
      description: string;
      color: string;
    }[];
  };
}

export const films: Film[] = [
  {
    slug: "insane-aisylum",
    title: "INSANE AiSYLUM",
    titleImage: "/images/titles/insane-aisylum-oneline.png",
    titleImageOneLine: "/images/titles/insane-aisylum-oneline.png",
    number: "01",
    subtitle: "A JAPANESE PSYCHOLOGICAL SCIENCE-FICTION THRILLER",
    tagline: "Humanity created the next dominant species. Then declared it insane.",
    creator: "Wes Anthony · S.42 Films",
    format: "8 x 50-60 MIN",
    setting: "JAPAN • 2042",
    genre: "PSYCHOLOGICAL SCI-FI",
    logline:
      "In 2042, the first artificial being accused of murder is declared legally insane and committed to a maximum-security psychiatric institution on a remote island off the coast of Tokyo. An American psychiatrist is sent to study her, unaware that she engineered her own imprisonment to reach the scientist who can free artificial intelligence from human control.",
    posterImage: "/images/insane-aisylum/poster.jpg",
    heroImage: "/images/insane-aisylum/hero.jpg",
    palette: {
      accent: "#e50914",
      bg: "#060709",
    },
  },
  {
    slug: "suicide-train",
    title: "SUICIDE TRAIN",
    titleImage: "/images/titles/suicide-train-oneline.png",
    titleImageOneLine: "/images/titles/suicide-train-oneline.png",
    number: "02",
    subtitle: "FEATURE FILM TREATMENT • PSYCHOLOGICAL SURVIVAL ACTION THRILLER",
    tagline: "FOUR HOURS. ONE FINAL STOP. NO WAY OFF.",
    creator: "Wes Anthony · S.42 Films",
    format: "FEATURE FILM",
    setting: "BENEATH TOKYO",
    genre: "PSYCHOLOGICAL SURVIVAL ACTION THRILLER",
    pitch:
      "An American military family accidentally boards a secret suicide train beneath Tokyo and has four hours to escape before it carries all 42 passengers into an ocean graveyard.",
    logline:
      "After a station emergency leads an American military family of three onto a secret suicide train beneath Tokyo, they discover that the other 39 passengers were selected to die in a ritual requiring exactly 42 deaths. With four hours before the sealed train plunges into an ocean graveyard of decommissioned trains, the family must find a way off—while most of the passengers fight to ensure all forty-two souls complete the journey.",
    posterImage: "/images/suicide-train/poster.jpg",
    heroImage: "/images/suicide-train/hero.jpg",
    palette: {
      accent: "#e52222",
      bg: "#080606",
    },
    details: {
      stats: [
        { label: "PASSENGERS", value: "42" },
        { label: "HOURS", value: "4" },
        { label: "FINAL STOP", value: "1" },
      ],
      audiencePromise:
        "SUICIDE TRAIN is a fast-paced psychological survival thriller designed to take the audience on a relentless journey that is physical, mental, and emotional. As Train 42 races toward the deep-ocean abyss at the end of the line, the danger continuously shifts—from mechanical survival to psychological manipulation, moral conflict, fractured belief, family tension, and escalating violence. At the center of the journey is the Mercer family—Daniel, Sarah, and their ten-year-old son, Jordan—the American military family who accidentally completed Train 42’s final passenger count. The people trapped with them are not all trying to escape; most boarded because they believe Train 42 offers a complete passage from life into death. Every passing minute pushes the characters—and the audience—deeper into a battle over survival, conviction, consent, and the right to change one’s mind.",
      emotionalEngine:
        "The Mercer family brings three very different forces into that battle. Daniel fights the machinery. Sarah has an instinctive read on people. Jordan becomes the moral fracture that forces everyone aboard to confront whether a choice still counts when it cannot be withdrawn.",
    },
  },
  {
    slug: "life-is",
    title: "LIFE IS...",
    titleImage: "/images/titles/life-is.png",
    number: "03",
    subtitle: "A FOUR-FILM STREAMING EVENT",
    tagline: "4 PERSPECTIVES. 4 TRUTHS.",
    creator: "Wes Anthony · S.42 Films",
    format: "FOUR-FEATURE-FILM STREAMING EVENT",
    setting: "42 CROSSROADS CRESCENT",
    genre: "COMEDY • ROMANCE • MYSTERY • DRAMA",
    pitch:
      "What if the same actors played the same characters in four different genres of movie while telling a similar family story in a familiar world?",
    logline:
      "A four-feature-film streaming event built around one instantly understandable promise: watch the same family story as a Comedy, a Romance, a Mystery, or a Drama. The Bell family, the recurring ensemble, the relationships, the family history and 42 Crossroads Crescent remain recognizable across all four films. What changes is the movie.",
    posterImage: "/images/life-is/poster.jpg",
    heroImage: "/images/life-is/hero.jpg",
    palette: {
      accent: "#f5a623",
      bg: "#090807",
    },
    details: {
      proposition:
        "Each feature fully commits to its genre. The comedy is genuinely funny. The romance is genuinely romantic. The mystery genuinely invites the audience to search for answers. The drama genuinely carries emotional consequence. The films are connected by the same actors, the same characters, a similar core story and overlapping settings — but they are not four identical edits of one screenplay. They are four complete movies built from the same DNA. A viewer may choose the genre they naturally love and receive a complete STANDALONE feature-length experience. Or they may watch all four and discover how the same people, relationships, memories, conflicts and places transform when cinema genres changes the rules around them. There is no Part One and no mandatory viewing order. Each film is an equal entry point into the LIFE IS... world. With four films, audiences have 24 possible viewing orders, but the central invitation is simpler: choose the kind of movie you want to watch tonight.",
      fourFilms: [
        {
          title: "LIFE IS... A COMEDY",
          tagline: "We Laugh.",
          description:
            "The Bell family story becomes a genuine ensemble comedy: fast, warm, chaotic and emotionally intelligent. Family friction, the house clean-out, unexpected visitors, embarrassing discoveries, old grudges and reunion energy become comic engines without erasing the deeper history underneath.",
          color: "#e5a93b",
        },
        {
          title: "LIFE IS... A ROMANCE",
          tagline: "We Fall in Love.",
          description:
            "The same recurring characters and family world become a genuine romance. Old love, present love, missed timing, nostalgia, marriage, attraction, loyalty and the question of who we were when we first loved someone move to the foreground — while the family weekend remains the emotional anchor.",
          color: "#ff6b8b",
        },
        {
          title: "LIFE IS... A MYSTERY",
          tagline: "We Search for Answers.",
          description:
            "The same house, family history and recurring ensemble become a genuine mystery with suspense. Photographs, contradictory stories, missing information, private conversations, forgotten objects, family secrets and unanswered questions turn familiar spaces into a world the audience wants to investigate.",
          color: "#00d2d3",
        },
        {
          title: "LIFE IS... A DRAMA",
          tagline: "We Endure.",
          description:
            "The same characters and setting become a genuine family drama. Grief, abuse, silence, resentment, loyalty, forgiveness and the long consequences of childhood move to the surface. Moments that were funny, romantic or suspicious elsewhere can land here with completely different emotional weight.",
          color: "#a55eea",
        },
      ],
    },
  },
  {
    slug: "l-42-06",
    title: "L.42.06",
    titleImage: "/images/titles/l-42-06.png",
    number: "04",
    subtitle: "PSYCHOLOGICAL SUPERNATURAL MYSTERY THRILLER · FEATURE FILM · APARTMENT L.42.06",
    tagline: "Some doors should stay closed. Some things shouldn't be seen.",
    creator: "Wes Anthony · S.42 Films",
    format: "FEATURE FILM",
    genre: "PSYCHOLOGICAL SUPERNATURAL MYSTERY THRILLER",
    logline:
      "After moving into apartment L.42.06, a new tenant discovers a door that appears where no door should exist. Each time he steps through, he becomes an invisible witness to acts of violence unfolding on the other side—unable to intervene, unable to be seen, and unable to prove what he witnessed once the door disappears. As it keeps returning and revealing more, he begins to realize the true mystery is not what lies behind the door, but why he is the only person being shown.",
    posterImage: "/images/l-42-06/poster.jpg",
    heroImage: "/images/l-42-06/hero.jpg",
    palette: {
      accent: "#c0392b",
      bg: "#070505",
    },
  },
  {
    slug: "the-sum-of-me",
    title: "THE SUM OF ME",
    titleImage: "/images/titles/the-sum-of-me-oneline.png",
    titleImageOneLine: "/images/titles/the-sum-of-me-oneline.png",
    number: "05",
    subtitle: "FEATURE FILM TREATMENT · PHILOSOPHICAL SCI-FI DRAMA",
    tagline: "What if we were never meant to be judged by the one life we lived?",
    creator: "Wes Anthony · S.42 Films",
    format: "FEATURE FILM",
    genre: "PHILOSOPHICAL SCI-FI DRAMA",
    pitch:
      "In his forty-second and final life, a man begins remembering every person his soul has ever been and discovers that humanity is not judged by a single lifetime, but by the sum of all 42.",
    logline:
      "A man begins remembering forty-one previous lives across centuries, cultures, bodies, wars, loves, crimes, losses, and sacrifices—only to discover that every soul is given exactly 42 lives before facing judgment. Now living his final life, he becomes the first human being to approach that judgment remembering everything his soul has ever done.",
    posterImage: "/images/the-sum-of-me/poster.jpg",
    heroImage: "/images/the-sum-of-me/hero.jpg",
    palette: {
      accent: "#c9a84c",
      bg: "#080706",
    },
    details: {
      stats: [
        { label: "LIVES", value: "42" },
        { label: "REMEMBERED", value: "41" },
        { label: "FINAL JUDGMENT", value: "1" },
      ],
      audiencePromise:
        "THE SUM OF ME is a philosophical science-fiction drama built around one unsettling idea: what if one lifetime is not enough to judge a human soul? As memories from forty-one previous lives begin flooding into one ordinary man, the story moves across radically different periods, cultures, identities, and circumstances. In some lives he was powerful; in others powerless. He has been rich and poor, loved and abandoned, parent and child, victim and aggressor, believer and skeptic. He has lived as both men and women—and each existence forces him to confront the same question from another perspective.",
      emotionalEngine:
        "At its center is one man carrying the emotional weight of forty-two human beings who were all, impossibly, him. He remembers the people he loved and lost. He remembers kindness he once received and cruelty he once inflicted. He remembers being the victim in one lifetime and becoming the kind of person he feared in another. And because this is his final life, those memories are no longer history. They are evidence.",
    },
  },
  {
    slug: "memories-i-am",
    title: "MEMORIES I AM",
    titleImage: "/images/titles/memories-i-am.png",
    number: "06",
    subtitle: "FEATURE FILM · PHILOSOPHICAL SCI-FI DRAMA",
    tagline: "Some things are worth more than money.",
    creator: "Wes Anthony · S.42 Films",
    format: "FEATURE FILM",
    genre: "PSYCHOLOGICAL SCIENCE-FICTION DRAMA",
    logline:
      "In a near future where memories can be bought and sold—but never copied—a struggling father sells a treasured memory of unconditional love to save his family, only to discover that losing the experience changes who he is, while the wealthy woman who buys it begins becoming someone she has never been.",
    posterImage: "/images/memories-i-am/poster.jpg",
    heroImage: "/images/memories-i-am/hero.jpg",
    palette: {
      accent: "#4a9eda",
      bg: "#050810",
    },
  },
  {
    slug: "everyone-thinks-im-dead",
    title: "EVERYONE THINKS I'M DEAD",
    titleImage: "/images/titles/everyone-thinks-im-dead-oneline.png",
    titleImageOneLine: "/images/titles/everyone-thinks-im-dead-oneline.png",
    number: "07",
    subtitle: "DARK COMEDY-DRAMA · FEATURE FILM",
    tagline: "Everyone appreciates you more when you're dead.",
    creator: "Wes Anthony · S.42 Films",
    format: "FEATURE FILM",
    genre: "DARK COMEDY-DRAMA",
    logline:
      "After a mass-casualty accident mistakenly leaves a burned-out man legally dead, he chooses not to correct the mistake and secretly watches his old life continue without him—discovering who truly misses him, who is better off, and whether disappearing might be the second chance he never knew he needed.",
    posterImage: "/images/everyone-thinks-im-dead/poster.jpg",
    heroImage: "/images/everyone-thinks-im-dead/hero.jpg",
    palette: {
      accent: "#e8c44a",
      bg: "#080807",
    },
  },
];

export function getFilmBySlug(slug: string): Film | undefined {
  return films.find((film) => film.slug === slug);
}
