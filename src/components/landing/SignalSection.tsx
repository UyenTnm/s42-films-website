"use client";

import { useEffect, useState } from "react";

export default function SignalSection() {
  const [waveform, setWaveform] = useState<number[]>([
    20, 45, 80, 60, 30, 95, 40, 70, 50, 85, 30, 60, 75, 90, 40, 20,
  ]);

  // Subtle real-time signal telemetry variation
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveform((prev) =>
        prev.map(() => Math.floor(Math.random() * 80) + 15)
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-6 md:px-16 bg-[#060606] border-t border-[#f1f1ed]/10 overflow-hidden relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Signal Information */}
        <div className="space-y-4 max-w-md">
          <div className="flex items-center gap-2 font-mono text-xs text-[#00f0ff] tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span>S•42 BEACON // 1420.405 MHz</span>
          </div>
          <h4 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f1f1ed]">
            Uninterrupted Transmission
          </h4>
          <p className="text-xs md:text-sm text-[#898989] font-mono leading-relaxed">
            All scripts and master reels are archived under atomic-clock synchronized
            timecodes. When the 42nd film completes, the signal permanently locks.
          </p>
        </div>

        {/* Live Visualizer Waves */}
        <div className="flex items-end gap-1.5 h-20 p-4 rounded-lg bg-[#0a0a0a] border border-[#f1f1ed]/10">
          {waveform.map((height, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-[#f1f1ed]/40 transition-all duration-700 ease-out"
              style={{
                height: `${height}%`,
                backgroundColor: i % 4 === 0 ? "#00f0ff" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
