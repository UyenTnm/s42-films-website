"use client";

export default function SignalSection() {
  return (
    <section className="py-24 px-6 md:px-16 bg-[#060606] border-t border-[#f1f1ed]/10 overflow-hidden relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex items-center gap-3 font-mono text-xs text-[#898989] tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f1f1ed] animate-pulse" />
          <span>PROJECT HOOKS // THREE VISIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-xs">
          <div className="p-6 rounded-lg border border-[#e50914]/20 bg-[#0a0606] space-y-3">
            <span className="text-[#e50914] font-bold text-sm block">01 // INSANE AiSYLUM</span>
            <blockquote className="text-base text-[#f1f1ed] italic font-serif">
              &ldquo;Humanity created the next dominant species. Then declared it insane.&rdquo;
            </blockquote>
            <p className="text-[11px] text-[#898989] pt-2 border-t border-[#e50914]/10">
              JAPAN • 2042 • 8 x 50-60 MIN
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[#e52222]/20 bg-[#0a0606] space-y-3">
            <span className="text-[#e52222] font-bold text-sm block">02 // SUICIDE TRAIN</span>
            <blockquote className="text-base text-[#f1f1ed] italic font-serif">
              &ldquo;FOUR HOURS. ONE FINAL STOP. NO WAY OFF.&rdquo;
            </blockquote>
            <p className="text-[11px] text-[#898989] pt-2 border-t border-[#e52222]/10">
              42 PASSENGERS • 4 HOURS • 1 FINAL STOP
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[#f5a623]/20 bg-[#0a0806] space-y-3">
            <span className="text-[#f5a623] font-bold text-sm block">03 // LIFE IS...</span>
            <blockquote className="text-base text-[#f1f1ed] italic font-serif">
              &ldquo;SAME FAMILY. SAME ACTORS. SAME HOUSE. SAME WEEKEND. DIFFERENT MOVIE.&rdquo;
            </blockquote>
            <p className="text-[11px] text-[#898989] pt-2 border-t border-[#f5a623]/10">
              4 PERSPECTIVES. 4 TRUTHS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
