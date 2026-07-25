import TopBar from "@/components/shared/TopBar";
import StatCard from "@/components/ui/StatCard";
import { formatINR } from "@/lib/utils";

export default function SuperAdminDashboardPage() {
  return (
    <div>
      <TopBar title="Platform overview" sub="All markets" />
      <div className="px-5 grid grid-cols-2 gap-3">
        <StatCard label="GMV this month" value={formatINR(1284000)} />
        <StatCard label="Take rate" value="15%" />
        <StatCard label="Active designers" value="86" sub="across 4 cities" />
        <StatCard label="Active markets" value="4" />
      </div>
    </div>
  );
}
