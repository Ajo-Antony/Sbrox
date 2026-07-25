import TopBar from "@/components/shared/TopBar";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";
import { PLATFORM_COMMISSION_PERCENT } from "@/lib/constants";

const PAYOUTS = [
  { id: "po_1", date: "Jul 22, 2026", amount: 4235, status: "Paid" },
  { id: "po_2", date: "Jul 15, 2026", amount: 3810, status: "Paid" }
];

export default function EarningsPage() {
  return (
    <div>
      <TopBar title="Earnings" sub={`Platform fee: ${PLATFORM_COMMISSION_PERCENT}% per booking`} />
      <div className="px-5 grid grid-cols-2 gap-3 mb-5">
        <StatCard label="This week" value={formatINR(6120)} sub="18 calls" />
        <StatCard label="Lifetime" value={formatINR(48210)} sub="142 calls" />
      </div>
      <div className="section-label">Recent payouts</div>
      <div className="px-5 flex flex-col gap-3">
        {PAYOUTS.map((p) => (
          <Card key={p.id} className="flex justify-between items-center">
            <div className="text-sm">{p.date}</div>
            <div className="font-display font-semibold text-coraldark">{formatINR(p.amount)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
