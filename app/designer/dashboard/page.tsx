"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import StatCard from "@/components/ui/StatCard";
import AvailabilityToggle from "@/components/designer/AvailabilityToggle";
import BookingRequestCard from "@/components/designer/BookingRequestCard";
import { formatINR } from "@/lib/utils";
import { getStoredBookings, BookingData } from "@/lib/store";

export default function DesignerDashboardPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);

  const refresh = () => {
    setBookings(getStoredBookings());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("quikdraw_data_changed", refresh);
    return () => window.removeEventListener("quikdraw_data_changed", refresh);
  }, []);

  const totalEarningsToday = bookings
    .filter((b) => b.status === "completed" || b.status === "confirmed" || b.status === "in_progress")
    .reduce((acc, curr) => acc + curr.total, 0);

  const completedCount = bookings.filter((b) => b.status === "completed").length;

  return (
    <div>
      <TopBar title="Dashboard" sub="Meera Nair · Product & UI Designer" />
      <div className="px-5 mb-4">
        <AvailabilityToggle />
      </div>
      <div className="px-5 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Today's earnings" value={formatINR(totalEarningsToday || 1847)} sub={`${completedCount || 3} calls completed`} />
        <StatCard label="Rating" value="4.9" sub="128 client reviews" />
      </div>
      <div className="section-label">Live booking requests</div>
      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {bookings.map((b) => (
          <BookingRequestCard key={b.id} b={b} />
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-8 text-xs text-inksoft bg-white rounded-xl border border-line p-4">
            No booking requests right now. Ensure your availability toggle is ON!
          </div>
        )}
      </div>
    </div>
  );
}
