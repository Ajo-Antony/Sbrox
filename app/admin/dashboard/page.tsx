import TopBar from "@/components/shared/TopBar";
import StatCard from "@/components/ui/StatCard";
import { formatINR } from "@/lib/utils";

export default function AdminDashboardPage() {
  return (
    <div>
      <TopBar title="Overview" sub="Kochi market" />
      <div className="px-5 grid grid-cols-2 gap-3">
        <StatCard label="Live bookings" value="14" sub="across 9 designers" />
        <StatCard label="GMV today" value={formatINR(42300)} />
        <StatCard label="Pending approvals" value="3" />
        <StatCard label="Open disputes" value="1" />
      </div>
    </div>
  );
}
