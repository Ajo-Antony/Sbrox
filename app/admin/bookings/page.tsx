import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";

const MOCK = [
  { id: "bk_2001", user: "Ananya R.", designer: "Meera Nair", total: 548, status: "In call" },
  { id: "bk_2000", user: "Kiran S.", designer: "Meera Nair", total: 499, status: "Confirmed" },
  { id: "bk_1990", user: "Farhan M.", designer: "Divya Krishnan", total: 299, status: "Completed" }
];

export default function AdminBookingsPage() {
  return (
    <div>
      <TopBar title="All bookings" />
      <div className="px-5 flex flex-col gap-3">
        {MOCK.map((b) => (
          <Card key={b.id} className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-[15px]">{b.user}</div>
              <div className="text-xs text-inksoft mt-0.5">with {b.designer}</div>
            </div>
            <div className="text-right">
              <Badge>{b.status}</Badge>
              <div className="font-display font-semibold text-coraldark mt-1">
                {formatINR(b.total)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
