"use client";

import { useEffect, useState } from "react";
import { getStoredCommission, saveCommission } from "@/lib/store";

export default function CommissionSlider({
  onChange
}: {
  onChange?: (val: number) => void;
}) {
  const [value, setValue] = useState(15);

  useEffect(() => {
    const stored = getStoredCommission();
    setValue(stored);
  }, []);

  const handleChange = (newVal: number) => {
    setValue(newVal);
    if (onChange) onChange(newVal);
  };

  return (
    <div>
      <div className="flex justify-between items-center text-sm font-semibold mb-2">
        <span>Platform Commission Fee</span>
        <span className="text-coraldark font-display text-lg font-bold">{value}%</span>
      </div>
      <input
        type="range"
        min={5}
        max={30}
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full accent-coral cursor-pointer h-2 bg-line rounded-lg"
      />
      <div className="flex justify-between text-xs text-inksoft mt-2 font-medium">
        <span>5% (Low fee)</span>
        <span>15% (Default)</span>
        <span>30% (High fee)</span>
      </div>
    </div>
  );
}
