"use client";
import { PAYMENT_METHODS } from "@/lib/constants";

export default function PaymentMethodList({
  selected,
  onSelect
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 my-3.5">
      {PAYMENT_METHODS.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`flex items-center gap-3 border rounded-xl2 px-3.5 py-3 text-sm font-medium ${
            selected === p.id ? "border-ink bg-[#F4F1E9]" : "border-line bg-white"
          }`}
        >
          <span className="w-[30px] h-[30px] rounded-lg bg-sagebg flex items-center justify-center text-sm">
            {p.icon}
          </span>
          {p.label}
          <span
            className={`ml-auto w-[18px] h-[18px] rounded-full border-2 ${
              selected === p.id ? "border-coral bg-coral/20" : "border-line"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
