import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";

const MOCK_BOOKINGS = [
  {
    id: "bk_1001",
    designerName: "Meera Nair",
    category: "UI Design",
    status: "completed" as const,
    slot: "Today, 2:15 PM",
    total: 548
  },
  {
    id: "bk_1000",
    designerName: "Divya Krishnan",
    category: "Photoshop",
    status: "confirmed" as const,
    slot: "Today, 4:00 PM",
    total: 299
  }
];

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Upcoming",
  in_progress: "In call",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed"
};

export default async function BookingsPage({
  searchParams
}: {
  searchParams: Promise<{ justBooked?: string }>;
}) {
  const { justBooked } = await searchParams;

  return (
    <div>
      <TopBar title="Your bookings" />
      {justBooked && (
        <div className="mx-5 mb-4 bg-sagebg text-sage text-sm font-semibold rounded-xl2 px-4 py-3">
          Booked. Your designer has been notified and will meet you in the video room at your
          slot time.
        </div>
      )}
      <div className="px-5 flex flex-col gap-3">
        {MOCK_BOOKINGS.map((b) => (
          <Card key={b.id}>
            <div className="flex justify-between items-start">
              <div className="font-semibold text-[15px]">{b.designerName}</div>
              <Badge>{STATUS_LABEL[b.status]}</Badge>
            </div>
            <div className="text-xs text-inksoft mt-1">
              {b.category} · {b.slot}
            </div>
            <div className="font-display font-semibold text-coraldark mt-2">
              {formatINR(b.total)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
