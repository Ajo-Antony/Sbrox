import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const MOCK = [
  {
    id: "disp_11",
    booking: "bk_1978",
    user: "Rohan K.",
    designer: "Rahul Menon",
    reason: "Designer didn't join the call",
    status: "Open"
  }
];

export default function AdminDisputesPage() {
  return (
    <div>
      <TopBar title="Disputes" />
      <div className="px-5 flex flex-col gap-3">
        {MOCK.map((d) => (
          <Card key={d.id}>
            <div className="flex justify-between items-start">
              <div className="font-semibold text-[15px]">{d.user} vs {d.designer}</div>
              <Badge>{d.status}</Badge>
            </div>
            <div className="text-xs text-inksoft mt-1">{d.reason}</div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" className="!px-3 !py-1.5 text-xs flex-1">
                Refund user
              </Button>
              <Button variant="sage" className="!px-3 !py-1.5 text-xs flex-1">
                Pay designer
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
