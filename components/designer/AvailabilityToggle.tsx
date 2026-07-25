"use client";
import { useState } from "react";

export default function AvailabilityToggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-full flex items-center justify-between rounded-xl2 px-4 py-3.5 ${
        on ? "bg-sage text-white" : "bg-ink text-white"
      }`}
    >
      <span className="font-semibold text-sm">{on ? "You're available now" : "Offline"}</span>
      <span
        className={`w-11 h-6 rounded-full relative transition-colors ${
          on ? "bg-white/30" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
            on ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
