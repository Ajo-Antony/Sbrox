import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface BookingData {
  id: string;
  user: string;
  designer: string;
  category: string;
  slot: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed";
  rate: number;
  date: string;
}

interface BookingTableProps {
  bookings: BookingData[];
  onSelectBooking: (id: string) => void;
}

export default function BookingTable({ bookings, onSelectBooking }: BookingTableProps) {
  const statusBgColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-sagebg text-sage";
      case "confirmed": return "bg-blue-50 text-blue-600";
      case "pending": return "bg-amber-50 text-amber-700";
      case "cancelled": return "bg-red-50 text-red-600";
      case "disputed": return "bg-red-50 text-red-600";
      case "in_progress": return "bg-purple-50 text-purple-600";
      default: return "";
    }
  };

  return (
    <div className="space-y-2">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="cursor-pointer hover:border-ink/30 transition-colors"
          onClick={() => onSelectBooking(booking.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-sm">{booking.user} → {booking.designer}</div>
              <div className="text-xs text-inksoft mt-0.5">{booking.category} • {booking.slot}</div>
              <div className="text-xs text-inksoft mt-1">ID: {booking.id} • {booking.date}</div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <div className="font-semibold text-sm">₹{booking.rate}</div>
                <Badge className={statusBgColor(booking.status)}>{booking.status}</Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
