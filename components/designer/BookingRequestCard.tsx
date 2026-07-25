import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

export interface BookingRequest {
  id: string;
  userName: string;
  category: string;
  slot: string;
  total: number;
  status: "pending" | "confirmed" | "in_progress" | "completed";
}

export default function BookingRequestCard({ b }: { b: BookingRequest }) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="font-semibold text-[15px]">{b.userName}</div>
        <Badge>{b.status}</Badge>
      </div>
      <div className="text-xs text-inksoft mt-1">
        {b.category} · {b.slot}
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <div className="font-display font-semibold text-coraldark">{formatINR(b.total)}</div>
        {b.status === "pending" && (
          <div className="flex gap-2">
            <Button variant="outline" className="!px-3 !py-1.5 text-xs">
              Decline
            </Button>
            <Button variant="sage" className="!px-3 !py-1.5 text-xs">
              Accept
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
