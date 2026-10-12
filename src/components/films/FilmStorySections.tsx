import type { FilmSection } from "@/data/films";

interface FilmStorySectionsProps {
  sections?: FilmSection[];
  closingStatement?: string;
  accentColor: string;
}

export default function FilmStorySections({
  sections,
  closingStatement,
  accentColor,
}: FilmStorySectionsProps) {
  if (!sections?.length && !closingStatement) {
    return null;
  }

  return (
    <div className="space-y-8">
      {sections?.map((section) => (
        <section
          key={section.title}
          className="space-y-4 rounded-lg border bg-white/[0.018] p-5 sm:p-6"
          style={{ borderColor: `${accentColor}33` }}
        >
          <h3
            className="font-mono text-xs font-bold uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            {section.title}
          </h3>
          <div className="space-y-4 text-sm leading-relaxed text-[#b8b8b3] sm:text-base">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      {closingStatement && (
        <blockquote
          className="border-l-2 py-2 pl-6 font-serif text-lg font-semibold italic leading-relaxed text-[#f1f1ed] sm:text-xl"
          style={{ borderColor: accentColor }}
        >
          {closingStatement}
        </blockquote>
      )}
    </div>
  );
}
