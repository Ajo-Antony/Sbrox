"use client";
import { TIP_OPTIONS } from "@/lib/constants";
import { formatINR } from "@/lib/utils";

export default function TipSelector({
  tip,
  onChange
}: {
  tip: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="bg-goldbg rounded-xl2 p-4 my-4">
      <div className="flex justify-between font-semibold text-sm">
        <span>Tip the work</span>
        <span className="font-display text-coraldark">{formatINR(tip)}</span>
      </div>
      <div className="flex gap-2 mt-3">
        {TIP_OPTIONS.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`flex-1 text-center py-2 rounded-lg text-[13px] font-semibold border ${
              tip === v ? "bg-gold border-gold text-white" : "bg-white border-line text-ink"
            }`}
          >
            {v === 0 ? "No tip" : formatINR(v)}
          </button>
        ))}
      </div>
    </div>
  );
}
