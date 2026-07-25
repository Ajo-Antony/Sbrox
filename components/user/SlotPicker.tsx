"use client";

const LABELS = ["Now", "+15 min", "+30 min"];

export default function SlotPicker({
  selected,
  onSelect
}: {
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 my-3.5">
      {LABELS.map((label, i) => (
        <button
          key={label}
          onClick={() => onSelect(i)}
          className={`border rounded-lg py-2.5 text-center text-[13px] font-semibold ${
            selected === i
              ? "bg-coral text-white border-coral"
              : "bg-white border-line text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
