import Card from "@/components/ui/Card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsCardProps {
  label: string;
  value: string | number;
  trend?: number;
  sub?: string;
  icon?: React.ReactNode;
  color?: "sage" | "coral" | "amber" | "ink" | "purple";
}

export default function MetricsCard({ label, value, trend, sub, icon, color = "sage" }: MetricsCardProps) {
  const colorClass = {
    sage: "text-sage",
    coral: "text-coral",
    amber: "text-amber-600",
    ink: "text-ink",
    purple: "text-purple-600",
  }[color];

  const bgColorClass = {
    sage: "bg-sagebg",
    coral: "bg-coral/10",
    amber: "bg-amber-50",
    ink: "bg-canvas",
    purple: "bg-purple-50",
  }[color];

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-inksoft">{label}</div>
          <div className="font-display font-semibold text-2xl mt-1">{value}</div>
          {sub && <div className="text-xs text-inksoft mt-1">{sub}</div>}
          {trend !== undefined && (
            <div className={`text-xs font-semibold mt-2 flex items-center gap-1 ${trend >= 0 ? "text-sage" : "text-red-600"}`}>
              {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}% vs last period
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${bgColorClass} ${colorClass}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
