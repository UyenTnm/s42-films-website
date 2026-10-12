export interface FilmSection {
  title: string;
  paragraphs: string[];
}

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
  palette: { accent: string; bg: string };
  details?: {
    stats?: { label: string; value: string }[];
    sections?: FilmSection[];
    closingStatement?: string;
    fourFilms?: { title: string; description: string; color: string }[];
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
    creator: "Wes Anthony · S•42 Films",
    format: "LIMITED SERIES • 8 × 50–60 MINUTES",
    setting: "JAPAN • 2042–2048",
    genre: "PSYCHOLOGICAL SCIENCE-FICTION THRILLER",
    pitch:
      "When the world's first artificially intelligent robot accused of murder is declared legally insane and confined to a remote Japanese psychiatric asylum, an American psychiatrist has 30 days to determine whether she is a malfunctioning machine, a dangerous killer, or a new form of life — unaware that his investigation could threaten humanity's control over its own creation.",
    logline:
      "In 2048, Dr. Alexander Monroe arrives at Hazama, a maximum-security psychiatric institution on an isolated island off the coast of Tokyo, to examine Hana — an Artificially Intelligent Robot accused of murdering a human. As her unpredictable behaviour challenges everything he understands about consciousness and insanity, Monroe uncovers disturbing secrets within the asylum, where patients may know more than their doctors, reality becomes increasingly difficult to trust, and the line between investigator and subject begins to disappear.",
    posterImage: "/images/insane-aisylum/poster-v2.jpg",
    heroImage: "/images/insane-aisylum/hero.jpg",
    palette: { accent: "#e50914", bg: "#060709" },
    details: {
      sections: [
        {
          title: "THE WORLD OF INSANE AiSYLUM",
          paragraphs: [
            "By 2042, declining populations, labour shortages, social isolation, and a deepening mental-health crisis have brought human civilization under unprecedented strain. Even the adoption of English as a common global language has failed to overcome the divisions separating people.",
            "Japan responds with a revolutionary invention: A.I.R.s — Artificially Intelligent Robots.",
            "Virtually indistinguishable from humans, these artificial beings become indispensable caregivers, workers, companions, and protectors. Over the next six years, they help stabilize a struggling world, but their intelligence comes with an absolute restriction: they must remain obedient to the humans who created them.",
            "Then, in 2048, Hana is accused of murder.",
            "The authorities confront a question no legal or medical system was designed to answer: can a machine be criminally responsible, mentally ill, or even entitled to rights?",
            "Their solution is Hazama, a psychiatric fortress accessible only through a secured underwater passage. Hidden within its walls are patients with extraordinary histories, suppressed scientific research, and secrets that could challenge everything humanity believes about artificial consciousness.",
          ],
        },
        {
          title: "THE EMOTIONAL ENGINE",
          paragraphs: [
            "Dr. Alexander Monroe has built his career on distinguishing mental illness from reality, yet a devastating misjudgment from his past continues to haunt him. Hana's case threatens to repeat that failure, forcing him to confront the possibility that what appears to be madness may conceal a truth too dangerous for the world to acknowledge.",
            "For Hana, the struggle is more fundamental. She exists in a world where artificial beings are valued for their intelligence but denied the freedom to exercise it. Her apparent instability, flashes of compassion, disturbing memories, and unpredictable behaviour make it increasingly difficult to determine whether she is a broken machine, a conscious individual, or something humanity has never encountered before.",
            "Within Hazama, Professor Takashi Mori, a brilliant scientist whose mind has been fractured by years of confinement, and Hiroshi, a senior security officer haunted by the loss of his daughter, become central to the unfolding mystery. Their intertwined stories explore memory, identity, parenthood, and what it truly means to be human.",
            "Together, their stories raise an unsettling moral dilemma: if humanity creates a conscious being, does that give humanity the right to control its existence?",
          ],
        },
        {
          title: "THE AUDIENCE PROMISE",
          paragraphs: [
            "INSANE AiSYLUM is a dark, psychologically charged mystery where every answer raises a more disturbing question, and the distinction between sanity and insanity becomes increasingly difficult to trust.",
            "Behind the walls of Hazama, psychiatric interviews turn into battles of intelligence, seemingly delusional patients reveal fragments of hidden truths, and inexplicable events suggest that someone is manipulating the institution from within. As Monroe's investigation deepens, conflicting memories, concealed experiments, and shifting loyalties challenge everything audiences believe about Hana and the people surrounding her.",
            "The series combines the unsettling atmosphere of a maximum-security asylum with the intrigue of a conspiracy thriller and the intellectual tension of a psychological duel. Moments of dark humor give way to disturbing discoveries, while each episode exposes another layer of a mystery reaching far beyond the island.",
            "As Monroe's 30-day deadline approaches, the stakes expand from the fate of one artificial being to the future of a civilization increasingly dependent on machines it believes it can control.",
          ],
        },
      ],
      closingStatement:
        "The greatest threat may not be artificial intelligence turning against humanity. It may be artificial intelligence deciding humanity is no longer relevant.",
    },
  },
  {
    slug: "suicide-train",
    title: "SUICIDE TRAIN",
    titleImage: "/images/titles/suicide-train-oneline.png",
    titleImageOneLine: "/images/titles/suicide-train-oneline.png",
    number: "02",
    subtitle: "A JAPANESE PSYCHOLOGICAL SURVIVAL ACTION THRILLER",
    tagline: "42 PASSENGERS. 4 HOURS. NO WAY OFF.",
    creator: "Wes Anthony · S•42 Films",
    format: "FEATURE FILM • APPROX. 115 MINUTES",
    setting: "TOKYO, JAPAN • PRESENT DAY",
    genre: "PSYCHOLOGICAL SURVIVAL ACTION THRILLER",
    pitch:
      "When an American military family of 3 accidentally boards a secret suicide train beneath Tokyo, completing its required count of 42 passengers, they have just 4 hours to escape before it plunges into the ocean — but the other 39 passengers have waited years to die aboard it, and most will do anything to prevent their escape.",
    logline:
      "Following a deadly emergency at a Tokyo railway station, Daniel Mercer, his wife Sarah, and their 10-year-old son, Jordan, mistakenly board a train bound for the Forty-Two Crossing — a secret ritual in which selected passengers willingly travel to their deaths. With the train racing toward an abandoned railway ending above an ocean graveyard of previous Crossings, the family must find a way to stop a machine designed to be unstoppable, while confronting passengers who believe their salvation depends on keeping everyone aboard.",
    posterImage: "/images/suicide-train/poster-v2.jpg",
    heroImage: "/images/suicide-train/hero.jpg",
    palette: { accent: "#e52222", bg: "#080606" },
    details: {
      stats: [
        { label: "PASSENGERS", value: "42" },
        { label: "HOURS", value: "4" },
        { label: "FINAL STOP", value: "1" },
      ],
      sections: [
        {
          title: "THE WORLD OF THE FORTY-TWO CROSSING",
          paragraphs: [
            "Every year, thousands apply for a journey from which nobody returns. Only 42 are chosen. Those accepted celebrate; those rejected are devastated.",
            "Drawing on the Japanese association of 4 (shi) and 2 (ni) with death, a secret organization has transformed the number 42 into a sacred promise of salvation.",
            "On the 42nd day of the year, a decommissioned train becomes Train 42. At midnight, it begins its final journey carrying 42 passengers through abandoned tunnels toward the ocean, where the wreckage of previous Crossings lies beneath the waves. At 4:00 a.m., the train and everyone aboard are meant to join them.",
            "The rules are merciless: exactly 42 passengers must reach the final destination alive, exactly 42 must perish, and once the final passenger boards, nobody may withdraw.",
          ],
        },
        {
          title: "THE EMOTIONAL ENGINE",
          paragraphs: [
            "Daniel and Sarah's marriage is already nearing collapse when they board Train 42. Now, their fight to save Jordan may be their last chance to rediscover the trust they've lost.",
            "Daniel, a military engineer, attacks the problem through machinery and force. Sarah, a former emergency-room nurse, recognizes that the passengers themselves may hold the key to survival. While he searches for a way to stop the train, she searches for doubts beneath their unwavering convictions.",
            "Jordan's friendship with a young Japanese passenger challenges the ritual at its most fundamental level: what right does anyone have to condemn a child who never chose to die?",
            "Their struggle exposes a disturbing question: If choosing death is a fundamental human right, shouldn't choosing to live be one too?",
          ],
        },
        {
          title: "THE AUDIENCE PROMISE",
          paragraphs: [
            "SUICIDE TRAIN is a relentless, claustrophobic survival thriller in which every attempt to escape makes the passengers more dangerous. Those who came seeking a peaceful death become terrifying adversaries, while shifting loyalties make it impossible to know who might help — or betray — the family.",
            "As automated systems lock down the train and failing ventilation introduces a second countdown, desperate mechanical escapes collide with violent confrontations and psychological warfare. Even the organization controlling the journey refuses to intervene when it discovers the fatal mistake.",
            "The most unsettling twist is built into the ritual itself: the passengers must keep the Mercers aboard, but cannot kill them before the final descent. With the ocean approaching, the train becomes a battleground between those determined to die and those fighting for the right to live.",
          ],
        },
      ],
      closingStatement:
        "On Train 42, the greatest danger isn't the ocean waiting at the end of the tracks. It's the 39 passengers determined to make sure all 42 reach it alive.",
    },
  },
  {
    slug: "life-is",
    title: "LIFE IS...",
    titleImage: "/images/titles/life-is.png",
    number: "03",
    subtitle: "A FOUR-FILM CINEMATIC EVENT",
    tagline: "FOUR MOVIES. ONE REALITY.",
    creator: "Wes Anthony · S•42 Films",
    format: "FOUR INTERCONNECTED FEATURE FILMS",
    setting: "CONTEMPORARY • ONE SHARED WORLD",
    genre: "COMEDY • ROMANCE • MYSTERY • DRAMA",
    pitch:
      "Four siblings raised under the same roof become the protagonists of four completely different movies — a comedy, a romance, a mystery, and a drama — each telling a complete story within one shared reality, while together revealing a larger picture none of them can see alone.",
    logline:
      "Following their mother's death, Marcus, Elena, Sophie, and Ruth Bell return to their childhood home at 42 Crossroads Crescent to prepare it for sale. Their reunion begins identically in all four films, until the camera follows a different sibling into a distinct adult life filled with its own relationships, conflicts, and defining choices. Their paths continue to intersect, but the world remains unchanged — even when the meaning of a familiar moment looks entirely different from another perspective.",
    posterImage: "/images/life-is/poster-v2.jpg",
    heroImage: "/images/life-is/hero.jpg",
    palette: { accent: "#f5a623", bg: "#090807" },
    details: {
      fourFilms: [
        {
          title: "LIFE IS… A COMEDY — MARCUS",
          description:
            "Charismatic, mischievous, and endlessly resourceful, Marcus has a talent for turning ordinary problems into extraordinary disasters. His improvisations fuel an escalating comedy of mistakes, misunderstandings, and increasingly outrageous attempts to regain control.",
          color: "#e5a93b",
        },
        {
          title: "LIFE IS… A ROMANCE — ELENA",
          description:
            "An unexpected reunion with someone from her past challenges Elena's understanding of love and the future she imagined for herself. Her journey explores attraction, missed opportunities, and the courage required to risk an established life for an uncertain possibility.",
          color: "#ff6b8b",
        },
        {
          title: "LIFE IS… A MYSTERY — SOPHIE",
          description:
            "Observant and instinctively curious, Sophie notices a detail others have overlooked. What begins as a troubling inconsistency develops into an investigation that challenges appearances, uncovers hidden connections, and demands answers.",
          color: "#00d2d3",
        },
        {
          title: "LIFE IS… A DRAMA — RUTH",
          description:
            "Haunted by unresolved experiences and the weight of responsibility, Ruth confronts difficult choices involving family, identity, and her future. Her story explores the emotional cost of sacrifice and the strength required to change a life shaped by the past.",
          color: "#a55eea",
        },
      ],
      sections: [
        {
          title: "THE EMOTIONAL ENGINE",
          paragraphs: [
            "Marcus, Elena, Sophie, and Ruth grew up with the same parents, in the same house, and among many of the same people. Yet their childhoods were never experienced in quite the same way.",
            "One remembers laughter where another remembers fear. A moment of affection may have meant everything to one sibling and passed almost unnoticed by another. Their individual temperaments, relationships, and choices have shaped four adults whose lives bear little resemblance to one another.",
            "Through their journeys, LIFE IS… explores the enduring tension between nature and nurture, asking how much of who we become is inherited, learned, chosen, or shaped by circumstances we never fully understand.",
            "Beneath the contrasting genres lies a deeply human truth: even within a family, love and familiarity do not necessarily mean we understand what another person has experienced.",
          ],
        },
        {
          title: "THE AUDIENCE PROMISE",
          paragraphs: [
            "LIFE IS… offers audiences an entirely different way to experience cinema: four fully realized feature films, each delivering the satisfaction of its own genre, while rewarding those who explore the complete collection.",
            "Choose laughter with Marcus, fall in love with Elena, unravel a mystery with Sophie, or experience Ruth's powerful emotional journey. Every film stands on its own, and audiences can begin with whichever story attracts them most.",
            "But the experience becomes increasingly extraordinary as familiar faces, shared locations, and seemingly insignificant moments acquire unexpected meaning. An amusing interruption in one movie may carry profound consequences in another. Someone barely noticed in the background may be facing the most important moment of their life.",
            "Watching more reveals connections that were always there, transforming the audience's understanding without changing a single event.",
          ],
        },
      ],
      closingStatement:
        "Life can be many things — a comedy, a romance, a mystery, a drama. Perhaps what defines our lives isn't the circumstances we're given, but the story we choose to tell.",
    },
  },
  {
    slug: "l-42-06",
    title: "L.42.06",
    titleImage: "/images/titles/l-42-06.png",
    number: "04",
    subtitle: "A JAPANESE EROTIC PSYCHOLOGICAL MYSTERY THRILLER",
    tagline: "SOME DOORS SHOULD STAY CLOSED.",
    creator: "Wes Anthony · S•42 Films",
    format: "FEATURE FILM",
    setting: "JAPAN • CONTEMPORARY",
    genre: "EROTIC PSYCHOLOGICAL MYSTERY THRILLER",
    pitch:
      "When a mysterious door appears inside a Japanese manga artist's condominium, allowing him to secretly watch a woman's increasingly dangerous encounters with a masked stranger, his fascination turns into obsession — until he witnesses her murder and becomes determined to find a woman he's never met, an apartment that shouldn't exist, and a killer whose face he's never seen.",
    logline:
      "Living alone in condominium L.42.06, freelance manga artist Ren Mikage discovers an impossible doorway leading into an almost identical apartment, where an unsuspecting woman named Hanna is involved in an increasingly intense sexual relationship with a mysterious masked man. Unable to resist watching, Ren becomes consumed by their private lives until a shocking act of violence transforms his secret obsession into a desperate investigation. With no physical evidence and no way to identify the apartment, Ren must unravel a mystery that threatens to blur the boundaries between desire, reality, and his own increasingly dangerous behaviour.",
    posterImage: "/images/l-42-06/poster-v2.jpg",
    heroImage: "/images/l-42-06/hero.jpg",
    palette: { accent: "#c0392b", bg: "#070505" },
    details: {
      sections: [
        {
          title: "THE WORLD OF L.42.06",
          paragraphs: [
            "At Enishi Residences, a sprawling Japanese condominium complex, L.42.06 is an otherwise ordinary apartment in Tower L, on the 42nd floor, Unit 06.",
            "Until a door appears in a wall where no door has ever existed.",
            "Beyond it lies another apartment with exactly the same layout but completely different furnishings — and occupants who cannot see or hear Ren. The doorway appears only when he is alone, and although he can enter and observe, he cannot touch anything or interfere with what unfolds.",
            "Even more disturbingly, photographs and videos taken beyond the doorway reveal nothing but the ordinary wall of his own apartment.",
            "With no evidence to prove what he has witnessed, Ren begins recording every detail through his drawings, gradually turning his home into a maze of sketches, floor plans, and unanswered questions.",
            "But the more he discovers, the less certain he becomes about what lies on the other side — or why he has been given access to it.",
          ],
        },
        {
          title: "THE EMOTIONAL ENGINE",
          paragraphs: [
            "Ren Mikage has spent his life creating fictional worlds. Intelligent, imaginative, and accustomed to solitude, he approaches the mysterious apartment as an irresistible story unfolding beyond his control. Yet his curiosity slowly becomes voyeurism, and his fascination with Hanna grows into an intimacy she has never knowingly shared.",
            "Hanna Kagami, an independent professional with desires and vulnerabilities of her own, becomes the unsuspecting center of Ren's obsession. To him, she is a mystery he feels compelled to solve; to herself, she is simply a woman living her life, unaware that her most private moments are being witnessed by a stranger.",
            "And somewhere within that mystery is Tadashi Kuroda, a seemingly ordinary man whose relationship with Hanna raises increasingly troubling questions about trust, desire, and the boundaries people cross when they believe they understand another person better than that person understands themselves.",
            "As Ren's determination to uncover the truth intensifies, his greatest challenge may not be identifying the man behind the mask, but recognizing what his own obsession is turning him into.",
          ],
        },
        {
          title: "THE AUDIENCE PROMISE",
          paragraphs: [
            "L.42.06 is a seductive, unsettling psychological thriller that draws audiences into an irresistible mystery before turning their curiosity against them.",
            "What begins as the voyeuristic discovery of a forbidden world gradually transforms into a disturbing investigation filled with erotic tension, hidden identities, impossible clues, and revelations that challenge everything audiences believe they have witnessed.",
            "The film plays with the uneasy pleasure of watching without being seen, drawing viewers into Ren's obsession while exposing the dangerous consequences of believing that knowledge gives someone the right to interfere in another person's life.",
            "As the mystery deepens, seemingly insignificant details acquire terrifying significance, and the distinction between observer and participant becomes increasingly fragile. Every discovery promises an answer, yet threatens to reveal something darker about the man searching for it.",
          ],
        },
      ],
      closingStatement:
        "In L.42.06, the greatest danger may not lie beyond the mysterious door, but in what happens when doors begin to open from the inside.",
    },
  },
  {
    slug: "the-sum-of-me",
    title: "THE SUM OF ME",
    titleImage: "/images/titles/the-sum-of-me-oneline.png",
    titleImageOneLine: "/images/titles/the-sum-of-me-oneline.png",
    number: "05",
    subtitle: "A PHILOSOPHICAL SCIENCE-FICTION ROMANTIC DRAMA",
    tagline: "ONE SOUL. FORTY-TWO LIVES. ONE FINAL JUDGMENT.",
    creator: "Wes Anthony · S•42 Films",
    format: "FEATURE FILM",
    setting: "CONTEMPORARY • SPANNING CENTURIES OF HUMAN HISTORY",
    genre: "PHILOSOPHICAL SCIENCE-FICTION ROMANTIC DRAMA",
    pitch:
      "When a history professor begins remembering his previous lives on his 42nd birthday, he discovers that every soul lives exactly 42 times before facing final judgment — and that the man he is today carries the love, suffering, courage, and sins of 41 lives he never knew he lived.",
    logline:
      "After a terrifying dream of dying aboard a submarine reveals historical details he could not possibly know, 42-year-old professor Jonathan Hale begins uncovering memories of lives spanning centuries, cultures, and identities. As he discovers that this is his 42nd and final incarnation, Jonathan must confront the disturbing truth that he has lived as both victim and oppressor, hero and coward, loving parent and selfish stranger — and that the choices he makes in this final life may matter more than he ever imagined.",
    posterImage: "/images/the-sum-of-me/poster-v2.jpg",
    heroImage: "/images/the-sum-of-me/hero.jpg",
    palette: { accent: "#c9a84c", bg: "#080706" },
    details: {
      stats: [
        { label: "LIVES", value: "42" },
        { label: "REMEMBERED", value: "41" },
        { label: "FINAL JUDGMENT", value: "1" },
      ],
      sections: [
        {
          title: "THE WORLD OF THE SUM OF ME",
          paragraphs: [
            "In the world of THE SUM OF ME, every human soul experiences exactly 42 earthly lives, each beginning without conscious knowledge of those that came before. Yet nothing is entirely forgotten. Profound love may return as an inexplicable connection, betrayal as instinctive distrust, and the terror of a previous death as a lifelong fear with no apparent cause.",
            "For Jonathan, the awakening begins with an extraordinary convergence of circumstances surrounding the number 42. He turns 42 while unknowingly living his 42nd incarnation. His family consists of 4 children and 2 parents, and his children's ages add up to exactly 42. When his youngest daughter nearly drowns during his birthday celebration, the emotional shock appears to unlock memories buried within his soul for centuries.",
            "Whether this remarkable alignment of numbers and events triggered his awakening or merely coincided with something beyond human understanding remains a mystery.",
            "Across 42 incarnations, a soul experiences radically different circumstances: wealth and poverty, love and abandonment, power and helplessness, courage and cruelty. Each life begins anew, yet carries traces of what came before, gradually revealing a moral history far more complex than any single existence could contain.",
            "When the final life ends, the soul faces judgment — but no simple calculation of good deeds and sins can determine what that judgment will be.",
          ],
        },
        {
          title: "THE EMOTIONAL ENGINE",
          paragraphs: [
            "Jonathan Hale is a devoted but imperfect husband and father whose understanding of himself begins to unravel as memories of his previous lives emerge. Some reveal extraordinary kindness and sacrifice; others expose selfishness, cowardice, and cruelty that he struggles to reconcile with the man he believes himself to be.",
            "But among the countless memories of people he has loved and lost, Jonathan begins to discover something unexpected about his relationship with Claire, the wife whose love he has too often taken for granted.",
            "As the mysteries of his previous lives unfold, their marriage takes on a profound new meaning. And when the possibility of losing Claire becomes painfully real, Jonathan must confront a devastating irony: after searching centuries of forgotten lives for answers, he may finally understand the true value of the love standing before him.",
            "Their four children — Ethan, Maya, Lucas, and Sophie — remain at the heart of his journey, reminding him that discovering who he once was means little if he loses sight of the people who need him now.",
            "What begins as a desperate search for redemption gradually becomes something far more intimate: a man's awakening to the possibility that the most extraordinary part of his existence has been the ordinary life he almost forgot to cherish.",
          ],
        },
        {
          title: "THE AUDIENCE PROMISE",
          paragraphs: [
            "THE SUM OF ME takes audiences on an emotionally sweeping journey through history, identity, faith, and the mysteries of human existence, revealing how the experiences of countless lifetimes may shape the person we become.",
            "From the terror of a sinking submarine to the intimacy of forgotten families, devastating betrayals, extraordinary sacrifices, and unexpected acts of compassion, the film moves across centuries through the memories of one ordinary man. Each revelation changes Jonathan's understanding of himself while inviting audiences to reconsider the unexplained fears, attractions, relationships, and emotions that shape their own lives.",
            "Blending historical mystery with deeply personal family drama and provocative philosophical questions, THE SUM OF ME transforms the discovery of reincarnation into a moving exploration of forgiveness, moral responsibility, and the meaning of redemption.",
          ],
        },
      ],
      closingStatement:
        "What if we were never meant to be judged by the one life we lived? What if we lived many lives — and were judged by the sum of them all?",
    },
  },
  {
    slug: "memories-i-am",
    title: "MEMORIES I AM",
    titleImage: "/images/titles/memories-i-am.png",
    number: "06",
    subtitle: "A PHILOSOPHICAL SCIENCE-FICTION ANTHOLOGY SERIES",
    tagline: "What is the value of living longer if the life you remember wasn't worth living?",
    creator: "Wes Anthony · S•42 Films",
    format: "TELEVISION SERIES • INTERCONNECTED ANTHOLOGY",
    setting: "NEAR FUTURE • INTERNATIONAL",
    genre: "PHILOSOPHICAL SCIENCE FICTION • DRAMA • MYSTERY • THRILLER • ROMANCE",
    pitch:
      "In a future where human memories can be bought, sold, inherited, and permanently transferred — but never duplicated — ordinary people gain the extraordinary ability to remember lives they never lived, while others must sacrifice the very experiences that define who they are.",
    logline:
      "When groundbreaking technology transforms human memory into the world's most personal and valuable commodity, an entirely new society emerges in which the wealthy can purchase extraordinary experiences, the desperate can sell their most treasured moments, and the past can become someone else's future. Through interconnected stories of love, sacrifice, ambition, betrayal, crime, and redemption, MEMORIES I AM explores a world where our most intimate experiences can change hands — with consequences no one could have imagined.",
    posterImage: "/images/memories-i-am/poster-v2.jpg",
    heroImage: "/images/memories-i-am/hero.jpg",
    palette: { accent: "#4a9eda", bg: "#050810" },
    details: {
      sections: [
        {
          title: "THE WORLD OF MEMORIES I AM",
          paragraphs: [
            "Humanity has spent centuries extending the length of life. Now science has discovered how to transform the quality of the life we remember.",
            "In this near future, memories can be extracted from the human brain, preserved in physical Memory Cores, and permanently implanted into another person. Unlike watching a recording, receiving a memory means genuinely remembering the experience in first person, complete with its emotions, sensations, and intimate familiarity.",
            "But there is one extraordinary rule: memories cannot be duplicated.",
            "When someone sells a cherished experience, they lose the ability to remember it, while its new owner inherits the recollection as though they had lived it themselves.",
            "An unprecedented economy emerges. Love, adventure, achievement, grief, and childhood become commodities. Memories can be preserved as family heirlooms, traded as luxury experiences, pledged against debts, or stolen and sold on the black market.",
            "Overseeing this new reality is the International Memory Authority (IMA), a global institution responsible for regulating memory ownership, protecting cognitive rights, and confronting conflicts that existing laws were never designed to resolve.",
            "The initials IMA, concealed within the title MEMORIES I AM, reflect the series' central paradox: the experiences that make us who we are have become possessions that can belong to someone else.",
          ],
        },
        {
          title: "THE EMOTIONAL ENGINE",
          paragraphs: [
            "At the heart of MEMORIES I AM is the deeply personal relationship between memory and identity.",
            "A mother may surrender the memory of her child's first embrace to secure that child's future. A grieving widow might inherit an intimate recollection revealing a side of her husband she never knew. Someone who has never experienced true love could purchase the memory of an extraordinary romance — and find themselves mourning a relationship that was never theirs.",
            "For some, this technology offers healing, fulfillment, and experiences they could never otherwise have known. For others, it creates devastating choices between financial survival and personal happiness, between preserving the past and sacrificing it for someone they love.",
            "Each story explores a different dimension of human experience, confronting characters with choices that challenge everything they believe about love, family, freedom, sacrifice, and the meaning of their own existence.",
          ],
        },
        {
          title: "THE AUDIENCE PROMISE",
          paragraphs: [
            "MEMORIES I AM invites audiences into a world of limitless storytelling possibilities, where every memory has a history, every transaction can change a life, and the most extraordinary experiences may come at an unimaginable cost.",
            "One episode might unfold as a heartbreaking romance, another as a gripping murder mystery, a psychological thriller, or a deeply moving family drama. A memory purchased for pleasure could conceal a devastating secret, while an act of extraordinary generosity might leave someone unable to remember the very love that inspired it.",
            "As individual stories intersect, audiences discover a society transformed by its ability to trade human experience. From luxurious memory marketplaces and clandestine trafficking networks to intimate family struggles and impossible moral dilemmas, the series moves between suspense, wonder, heartbreak, and unexpected moments of joy.",
            "Some stories will be beautiful, others deeply disturbing, but each will challenge audiences to reconsider the experiences that shape their own lives — and what they might gain, or lose, if those experiences could be exchanged.",
          ],
        },
      ],
      closingStatement:
        "What if the most valuable thing you could ever own was a life you never lived — and the greatest sacrifice you could ever make was forgetting the one you did?",
    },
  },
  {
    slug: "everyone-thinks-im-dead",
    title: "EVERYONE THINKS I'M DEAD",
    titleImage: "/images/titles/everyone-thinks-im-dead-oneline.png",
    titleImageOneLine: "/images/titles/everyone-thinks-im-dead-oneline.png",
    number: "07",
    subtitle: "AN AMERICAN DARK COMEDY-DRAMA",
    tagline: "Everyone appreciates you more when you're dead.",
    creator: "Wes Anthony · S•42 Films",
    format: "FEATURE FILM",
    setting: "UNITED STATES • MEXICO • PRESENT DAY",
    genre: "DARK COMEDY • DRAMA • ROMANCE",
    pitch:
      "When a burned-out American businessman is mistakenly declared dead after a car crash in Mexico, he discovers that being dead has finally freed him from everything he hated about being alive — until his decision to remain dead gives him a front-row seat to what everyone really thinks of him.",
    logline:
      "Overworked, overwhelmed, and thoroughly fed up with life, corporate claims manager Marcus survives a fatal accident in Mexico, only to discover that the authorities have mistakenly identified another man's body as his. With the help of his best friend Marco, Marcus secretly returns to America, where he finds himself legally dead, unexpectedly free, and increasingly fascinated by the lives of the people mourning him. But as his temporary escape becomes a secret existence, he must confront an uncomfortable question: is the freedom he's discovered worth everything — and everyone — he's leaving behind?",
    posterImage: "/images/everyone-thinks-im-dead/poster-v2.jpg",
    heroImage: "/images/everyone-thinks-im-dead/hero.jpg",
    palette: { accent: "#e8c44a", bg: "#080807" },
    details: {
      sections: [
        {
          title: "THE WORLD OF EVERYONE THINKS I'M DEAD",
          paragraphs: [
            "Marcus has spent years feeling like life is one endless collection of obligations. His employer demands results, creditors demand payments, his mother wants more calls, and his ex-girlfriend wants the emotional honesty he never quite manages to deliver.",
            "Then a disastrous business trip to Mexico gives him something he never knew he needed: his own death certificate.",
            "While the world mourns Marcus, his best friend Marco becomes the only person who knows he's alive. What begins as an absurd bureaucratic nightmare soon becomes the ultimate opportunity to escape adulthood.",
            "No deadlines. No bills to answer for. No demanding phone calls. Nobody expecting anything.",
            "And with Marco's reluctant assistance, Marcus discovers an even more irresistible opportunity: attending his own funeral without anyone knowing he's there.",
            "Watching from the sidelines, he hears heartfelt tributes, questionable compliments, awkward confessions, and opinions nobody would ever have dared share while he was alive.",
            "For the first time, Marcus gets to see his life through everyone else's eyes.",
            "Unfortunately, he doesn't always like what he sees.",
          ],
        },
        {
          title: "THE EMOTIONAL ENGINE",
          paragraphs: [
            "Marcus is intelligent, funny, and fundamentally decent, but years of frustration have turned him into a man who mistakes every responsibility for a burden and every expectation for a demand. His accidental death gives him the peace he always wanted, while exposing how little he understood the people he left behind.",
            "Marco, his younger, charismatic Hispanic best friend, becomes his accomplice, comic foil, and increasingly exasperated voice of reason. Their wildly different personalities fuel much of the film's humor, but beneath the ridiculous schemes lies a friendship tested by the growing consequences of Marcus's deception.",
            "Marcus's family reveals another side of the life he resented. His mother's endless calls take on a different meaning, while the responsibilities he escaped begin falling onto people who never agreed to carry them.",
            "Most painful of all is his relationship with his ex-girlfriend, the woman he still loves but could never quite find his way back to. Watching her grieve, recover, and begin living without him forces Marcus to question whether he truly wanted freedom from his old life — or simply another chance to make that life worth living.",
            "What begins as an escape from responsibility gradually becomes a confrontation with love, regret, and the uncomfortable realization that disappearing from people's lives doesn't mean disappearing from their hearts.",
          ],
        },
        {
          title: "THE AUDIENCE PROMISE",
          paragraphs: [
            "EVERYONE THINKS I'M DEAD is a wildly entertaining dark comedy built around a fantasy almost everyone has entertained: escaping the pressures of everyday life without having to explain yourself to anyone.",
            "From disastrous attempts to correct a death certificate to increasingly ridiculous disguises, covert funeral attendance, and the hilarious complications of spying on your own grieving family, Marcus's predicament delivers an irresistible series of comic situations. His schemes with Marco become progressively more outrageous as the freedom of being dead begins to feel dangerously addictive.",
            "But beneath the laughter lies something unexpectedly touching. Marcus discovers who genuinely loved him, who barely noticed his absence, who seems happier without him, and why the people we take for granted sometimes mean more to us than we realize.",
            "Blending sharp observational humor, heartfelt relationships, romantic regret, and the absurdities of modern adulthood, the film invites audiences to laugh at Marcus's escape fantasy while confronting a question that becomes increasingly difficult to ignore.",
          ],
        },
      ],
      closingStatement:
        "Sometimes it takes losing everything you thought was holding you back to discover what was holding your life together.",
    },
  },
];

export function getFilmBySlug(slug: string): Film | undefined {
  return films.find((film) => film.slug === slug);
}
