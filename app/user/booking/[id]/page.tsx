"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SlotPicker from "@/components/user/SlotPicker";
import TipSelector from "@/components/user/TipSelector";
import PaymentMethodList from "@/components/user/PaymentMethodList";
import Button from "@/components/ui/Button";
import { MOCK_DESIGNERS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const designer = MOCK_DESIGNERS.find((d) => d.id === id);

  const [slot, setSlot] = useState(0);
  const [tip, setTip] = useState(0);
  const [pay, setPay] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!designer) return null;
  const total = designer.ratePer15 + tip;

  async function confirm() {
    if (!pay) return;
    setSubmitting(true);
    try {
      // POST /api/bookings creates the booking + locks the slot server-side,
      // then /api/payments/webhook settles it once Razorpay confirms.
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designerId: id,
          slotId: `demo-slot-${slot}`,
          category: "UI Design",
          tip,
          paymentMethod: pay
        })
      });
      const data = await res.json();
      router.push(`/user/bookings?justBooked=${data.bookingId ?? "demo"}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="px-5 pt-6 pb-2">
        <Link
          href={`/user/designer/${id}`}
          className="inline-flex w-[34px] h-[34px] rounded-full border border-line items-center justify-center font-bold mb-2.5"
        >
          ←
        </Link>
        <div className="font-display font-semibold text-xl">Confirm your slot</div>
      </div>

      <div className="px-5">
        <div className="section-label !px-0">Choose a start time</div>
        <SlotPicker selected={slot} onSelect={setSlot} />

        <TipSelector tip={tip} onChange={setTip} />

        <div className="section-label !px-0">Payment method</div>
        <PaymentMethodList selected={pay} onSelect={setPay} />

        <Button
          variant="primary"
          className="w-full mb-8"
          disabled={!pay || submitting}
          onClick={confirm}
        >
          {submitting ? "Confirming…" : `Confirm & pay · ${formatINR(total)}`}
        </Button>
      </div>
    </div>
  );
}
