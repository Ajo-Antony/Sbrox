"use client";
import { useState } from "react";

export default function CommissionSlider({ initial = 15 }: { initial?: number }) {
  const [value, setValue] = useState(initial);
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold mb-2">
        <span>Platform commission</span>
        <span className="text-coraldark font-display">{value}%</span>
      </div>
      <input
        type="range"
        min={5}
        max={30}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-coral"
      />
      <div className="flex justify-between text-xs text-inksoft mt-1">
        <span>5%</span>
        <span>30%</span>
      </div>
    </div>
  );
}
