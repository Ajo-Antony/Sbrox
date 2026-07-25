import TopBar from "@/components/shared/TopBar";
import BookingRequestCard, { BookingRequest } from "@/components/designer/BookingRequestCard";

const MOCK: BookingRequest[] = [
  { id: "bk_2001", userName: "Ananya R.", category: "UI Design", slot: "Now", total: 548, status: "pending" },
  { id: "bk_2000", userName: "Kiran S.", category: "UI Design", slot: "Today, 3:00 PM", total: 499, status: "confirmed" },
  { id: "bk_1990", userName: "Farhan M.", category: "UI Design", slot: "Yesterday, 5:30 PM", total: 499, status: "completed" }
];

export default function DesignerBookingsPage() {
  return (
    <div>
      <TopBar title="Bookings" />
      <div className="px-5 flex flex-col gap-3">
        {MOCK.map((b) => (
          <BookingRequestCard key={b.id} b={b} />
        ))}
      </div>
    </div>
  );
}
