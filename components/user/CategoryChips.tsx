"use client";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryChips({
  active,
  onChange
}: {
  active: string;
  onChange: (cat: string) => void;
}) {
  const chips = ["All", ...CATEGORIES];
  return (
    <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
      {chips.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`flex-none px-3.5 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap border ${
            active === c ? "bg-ink text-white border-ink" : "bg-white text-inksoft border-line"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
