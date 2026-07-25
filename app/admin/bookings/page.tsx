"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";
import { getStoredBookings, BookingData } from "@/lib/store";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);

  const refresh = () => {
    setBookings(getStoredBookings());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("quikdraw_data_changed", refresh);
    return () => window.removeEventListener("quikdraw_data_changed", refresh);
  }, []);

  return (
    <div>
      <TopBar title="All bookings" sub="Live transaction & session logs across Kochi market" />
      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {bookings.map((b) => (
          <Card key={b.id} className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-[15px]">{b.userName}</div>
              <div className="text-xs text-inksoft mt-0.5">
                with {b.designerName} · {b.category}
              </div>
            </div>
            <div className="text-right">
              <Badge>{b.status.replace("_", " ")}</Badge>
              <div className="font-display font-semibold text-coraldark mt-1 text-sm">
                {formatINR(b.total)}
              </div>
            </div>
          </Card>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-10 text-xs text-inksoft bg-white rounded-xl border border-line p-6">
            No bookings recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
