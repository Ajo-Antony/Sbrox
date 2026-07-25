"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { updateBookingStatus } from "@/lib/store";

export interface BookingRequest {
  id: string;
  userName: string;
  category: string;
  slot: string;
  total: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed";
  notes?: string;
}

export default function BookingRequestCard({ b }: { b: BookingRequest }) {
  const handleAccept = () => {
    updateBookingStatus(b.id, "confirmed");
  };

  const handleDecline = () => {
    updateBookingStatus(b.id, "cancelled");
  };

  const handleStartCall = () => {
    updateBookingStatus(b.id, "in_progress");
  };

  return (
    <Card className="relative">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-[15px]">{b.userName}</div>
          <div className="text-xs text-inksoft mt-0.5">
            {b.category} · {b.slot}
          </div>
        </div>
        <Badge>{b.status.replace("_", " ")}</Badge>
      </div>

      {b.notes && (
        <div className="mt-2 text-xs bg-canvas p-2 rounded-lg border border-line text-inksoft">
          <span className="font-semibold text-ink">Topic:</span> {b.notes}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-line/60">
        <div className="font-display font-semibold text-coraldark">{formatINR(b.total)}</div>

        {b.status === "pending" && (
          <div className="flex gap-2">
            <Button variant="outline" className="!px-3 !py-1.5 text-xs" onClick={handleDecline}>
              Decline
            </Button>
            <Button variant="sage" className="!px-3 !py-1.5 text-xs" onClick={handleAccept}>
              Accept
            </Button>
          </div>
        )}

        {(b.status === "confirmed" || b.status === "in_progress") && (
          <Link href={`/room/${b.id}`} onClick={handleStartCall}>
            <Button variant="primary" className="!px-3.5 !py-1.5 text-xs flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Enter 15m Call Room →
            </Button>
          </Link>
        )}

        {b.status === "completed" && (
          <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            ✓ Session Finished
          </div>
        )}

        {b.status === "cancelled" && (
          <div className="text-xs text-inksoft italic">Declined</div>
        )}
      </div>
    </Card>
  );
}
