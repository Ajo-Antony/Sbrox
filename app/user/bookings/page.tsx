"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { getStoredBookings, BookingData } from "@/lib/store";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Upcoming",
  in_progress: "In Live Call",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed"
};

export default function BookingsPage({
  searchParams
}: {
  searchParams: Promise<{ justBooked?: string }>;
}) {
  const { justBooked } = use(searchParams);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  const refresh = () => {
    setBookings(getStoredBookings());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("quikdraw_data_changed", refresh);
    return () => window.removeEventListener("quikdraw_data_changed", refresh);
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter === "upcoming") return b.status === "confirmed" || b.status === "in_progress" || b.status === "pending";
    if (filter === "completed") return b.status === "completed";
    return true;
  });

  return (
    <div>
      <TopBar title="Your bookings" sub="Track your 15-minute quick design sessions" />

      {justBooked && (
        <div className="mx-5 mb-4 bg-sagebg text-sage text-xs font-semibold rounded-xl2 px-4 py-3 border border-sage/20 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm">🎉 Booking Confirmed!</div>
            <div>Your slot is locked. Click below to join your live video call room.</div>
          </div>
          <Link href={`/room/${justBooked}`}>
            <Button variant="sage" className="!px-3 !py-1.5 text-xs whitespace-nowrap ml-2">
              Join Call →
            </Button>
          </Link>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 px-5 mb-4">
        {(["all", "upcoming", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize border ${
              filter === tab
                ? "bg-ink text-white border-ink"
                : "bg-white text-inksoft border-line"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((b) => {
          const canJoin = b.status === "confirmed" || b.status === "in_progress" || b.status === "pending";
          return (
            <Card key={b.id} className="relative">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-[15px]">{b.designerName}</div>
                  <div className="text-xs text-inksoft mt-0.5">
                    {b.category} · {b.slot}
                  </div>
                </div>
                <Badge>{STATUS_LABEL[b.status] || b.status}</Badge>
              </div>

              {b.notes && (
                <div className="mt-2 text-xs bg-canvas p-2.5 rounded-lg border border-line text-inksoft">
                  <span className="font-semibold text-ink">Topic:</span> {b.notes}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-line/60">
                <div className="font-display font-semibold text-coraldark text-sm">
                  {formatINR(b.total)} {b.tip > 0 && <span className="text-xs text-inksoft font-normal">(incl. {formatINR(b.tip)} tip)</span>}
                </div>

                {canJoin ? (
                  <Link href={`/room/${b.id}`}>
                    <Button variant="primary" className="!px-3.5 !py-1.5 text-xs flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Join 15m Live Room →
                    </Button>
                  </Link>
                ) : (
                  <div className="text-xs text-inksoft font-medium">
                    {b.rating ? `★ Rated ${b.rating}.0` : "Session finished"}
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-inksoft bg-white rounded-xl2 border border-line p-6">
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-semibold text-sm text-ink mb-1">No bookings found</div>
            <div>Book a 15-minute slot with a top designer from the Browse tab!</div>
            <Link href="/user/browse" className="inline-block mt-3">
              <Button variant="outline" className="text-xs">
                Browse Designers
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
