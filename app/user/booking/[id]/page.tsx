"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SlotPicker from "@/components/user/SlotPicker";
import TipSelector from "@/components/user/TipSelector";
import PaymentMethodList from "@/components/user/PaymentMethodList";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { MOCK_DESIGNERS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import { getStoredDesigners, addBooking, DesignerData } from "@/lib/store";

const SLOT_LABELS = ["Now (Starts immediately)", "+15 min (Today)", "+30 min (Today)"];

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [designer, setDesigner] = useState<DesignerData | null>(null);
  const [slot, setSlot] = useState(0);
  const [tip, setTip] = useState(0);
  const [pay, setPay] = useState<string | null>("upi");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const designers = getStoredDesigners();
    const found = designers.find((d) => d.id === id) || MOCK_DESIGNERS.find((d) => d.id === id);
    if (found) {
      setDesigner(found as any);
    }
  }, [id]);

  if (!designer) {
    return (
      <div className="p-8 text-center text-sm text-inksoft">
        <div>Loading designer details…</div>
      </div>
    );
  }

  const rate = designer.ratePer15;
  const total = rate + tip;

  async function confirm() {
    if (!pay || !designer) return;
    setSubmitting(true);

    try {
      // Create local store booking
      const created = addBooking({
        designerId: designer.id,
        designerName: designer.name,
        userName: "You",
        category: designer.category,
        slot: SLOT_LABELS[slot],
        rate,
        tip,
        total,
        status: "confirmed",
        paymentMethod: pay,
        notes: notes || `15-minute ${designer.category} design review`
      });

      // Also hit the API endpoint if available
      try {
        await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            designerId: designer.id,
            slotId: `slot-${slot}`,
            category: designer.category,
            tip,
            paymentMethod: pay
          })
        });
      } catch (e) {
        // Fallback gracefully to local store
      }

      router.push(`/user/bookings?justBooked=${created.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="px-5 pt-6 pb-2 flex items-center gap-3">
        <Link
          href={`/user/designer/${id}`}
          className="w-[34px] h-[34px] rounded-full border border-line flex items-center justify-center font-bold bg-white text-ink"
        >
          ←
        </Link>
        <div>
          <div className="font-display font-semibold text-xl">Confirm your slot</div>
          <div className="text-xs text-inksoft">Booking with {designer.name}</div>
        </div>
      </div>

      <div className="px-5">
        {/* Designer Summary */}
        <Card className="my-3 flex items-center gap-3 bg-white">
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${designer.gradient[0]}, ${designer.gradient[1]})`
            }}
          />
          <div>
            <div className="font-semibold text-sm">{designer.name}</div>
            <div className="text-xs text-inksoft">{designer.headline}</div>
            <div className="text-xs font-semibold text-coral mt-0.5">
              {formatINR(designer.ratePer15)} / 15-minute slot
            </div>
          </div>
        </Card>

        {/* Start Time */}
        <div className="section-label !px-0 mt-4">Choose a start time</div>
        <SlotPicker selected={slot} onSelect={setSlot} />

        {/* Topic / Design Notes */}
        <div className="section-label !px-0 mt-4">What do you want to work on?</div>
        <textarea
          placeholder="e.g. Need quick UX feedback on mobile checkout flow or Figma component review..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-line rounded-xl2 p-3 text-xs bg-white resize-none h-20 mb-3 focus:outline-none focus:border-coral"
        />

        {/* Tip Selector */}
        <TipSelector tip={tip} onChange={setTip} />

        {/* Payment Method */}
        <div className="section-label !px-0 mt-4">Payment method</div>
        <PaymentMethodList selected={pay} onSelect={setPay} />

        {/* Total Summary */}
        <Card className="my-4 bg-[#FBF9F5] border-line">
          <div className="flex justify-between text-xs text-inksoft mb-1">
            <span>15-min slot fee</span>
            <span>{formatINR(rate)}</span>
          </div>
          {tip > 0 && (
            <div className="flex justify-between text-xs text-inksoft mb-1">
              <span>Designer tip</span>
              <span>{formatINR(tip)}</span>
            </div>
          )}
          <div className="h-px bg-line my-2" />
          <div className="flex justify-between font-bold text-sm text-ink">
            <span>Total Payable</span>
            <span className="font-display text-coraldark text-base">{formatINR(total)}</span>
          </div>
        </Card>

        <Button
          variant="primary"
          className="w-full mb-8 py-3.5 text-base shadow-md"
          disabled={!pay || submitting}
          onClick={confirm}
        >
          {submitting ? "Locking slot & redirecting…" : `Confirm & Pay · ${formatINR(total)}`}
        </Button>
      </div>
    </div>
  );
}
