import Card from "./Card";

export default function StatCard({
  label,
  value,
  sub
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <div className="text-xs font-semibold uppercase tracking-wider text-inksoft">{label}</div>
      <div className="font-display font-semibold text-2xl">{value}</div>
      {sub && <div className="text-xs text-inksoft">{sub}</div>}
    </Card>
  );
}
