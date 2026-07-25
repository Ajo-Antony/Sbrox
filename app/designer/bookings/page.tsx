"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import BookingRequestCard from "@/components/designer/BookingRequestCard";
import { getStoredBookings, BookingData } from "@/lib/store";

export default function DesignerBookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed">("all");

  const refresh = () => {
    setBookings(getStoredBookings());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("quikdraw_data_changed", refresh);
    return () => window.removeEventListener("quikdraw_data_changed", refresh);
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter === "pending") return b.status === "pending";
    if (filter === "confirmed") return b.status === "confirmed" || b.status === "in_progress";
    if (filter === "completed") return b.status === "completed";
    return true;
  });

  return (
    <div>
      <TopBar title="Bookings" sub="Manage incoming 15-minute slot requests" />

      {/* Filter Tabs */}
      <div className="flex gap-2 px-5 mb-4">
        {(["all", "pending", "confirmed", "completed"] as const).map((tab) => (
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
        {filtered.map((b) => (
          <BookingRequestCard key={b.id} b={b} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-inksoft bg-white rounded-xl border border-line p-6">
            No bookings found in this view filter.
          </div>
        )}
      </div>
    </div>
  );
}
