import Card from "@/components/ui/Card";

export interface AnalyticsDataPoint {
  label: string;
  value: string | number;
  color?: "sage" | "coral" | "amber" | "ink";
}

interface AnalyticsGridProps {
  title: string;
  data: AnalyticsDataPoint[];
  columns?: 2 | 3 | 4;
}

export default function AnalyticsGrid({ title, data, columns = 3 }: AnalyticsGridProps) {
  const getColorClass = (color: string = "ink") => {
    switch(color) {
      case "sage": return "border-l-sage";
      case "coral": return "border-l-coral";
      case "amber": return "border-l-amber-600";
      default: return "border-l-ink";
    }
  };

  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return (
    <Card>
      <div className="font-semibold text-sm mb-4">{title}</div>
      <div className={`grid ${colClass} gap-3`}>
        {data.map((item, idx) => (
          <div key={idx} className={`p-3 rounded-lg bg-canvas border-l-4 ${getColorClass(item.color)}`}>
            <div className="text-xs font-medium text-inksoft">{item.label}</div>
            <div className="font-semibold text-lg mt-1">{item.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
