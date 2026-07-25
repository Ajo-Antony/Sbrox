import TopBar from "@/components/shared/TopBar";
import StatCard from "@/components/ui/StatCard";
import AvailabilityToggle from "@/components/designer/AvailabilityToggle";
import BookingRequestCard, { BookingRequest } from "@/components/designer/BookingRequestCard";
import { formatINR } from "@/lib/utils";

const MOCK_REQUESTS: BookingRequest[] = [
  { id: "bk_2001", userName: "Ananya R.", category: "UI Design", slot: "Now", total: 548, status: "pending" },
  { id: "bk_2000", userName: "Kiran S.", category: "UI Design", slot: "Today, 3:00 PM", total: 499, status: "confirmed" }
];

export default function DesignerDashboardPage() {
  return (
    <div>
      <TopBar title="Dashboard" sub="Meera Nair" />
      <div className="px-5 mb-4">
        <AvailabilityToggle />
      </div>
      <div className="px-5 grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Today's earnings" value={formatINR(1847)} sub="6 calls" />
        <StatCard label="Rating" value="4.9" sub="128 reviews" />
      </div>
      <div className="section-label">Booking requests</div>
      <div className="px-5 flex flex-col gap-3">
        {MOCK_REQUESTS.map((b) => (
          <BookingRequestCard key={b.id} b={b} />
        ))}
      </div>
    </div>
  );
}
