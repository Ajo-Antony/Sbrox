import Card from "@/components/ui/Card";

export interface ChartData {
  label: string;
  value: number;
  percentage?: number;
}

interface AnalyticsChartProps {
  title: string;
  type: "bar" | "line";
  data: ChartData[];
  maxValue?: number;
}

export default function AnalyticsChart({ title, type, data, maxValue }: AnalyticsChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <Card>
      <div className="font-semibold text-sm mb-4">{title}</div>

      {type === "bar" && (
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-inksoft">{item.label}</span>
                <span className="text-xs font-semibold text-ink">{item.value}</span>
              </div>
              <div className="w-full bg-canvas rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sage h-2 transition-all duration-300"
                  style={{ width: `${(item.value / max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "line" && (
        <div className="space-y-2">
          <svg width="100%" height="120" className="mb-3" viewBox="0 0 200 100">
            {/* Grid lines */}
            <line x1="0" y1="100" x2="200" y2="100" stroke="#e5e5e5" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="200" y2="75" stroke="#e5e5e5" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="200" y2="50" stroke="#e5e5e5" strokeWidth="0.5" />
            <line x1="0" y1="25" x2="200" y2="25" stroke="#e5e5e5" strokeWidth="0.5" />

            {/* Line path */}
            <polyline
              points={data.map((item, idx) => `${(idx / (data.length - 1)) * 200},${100 - (item.value / max) * 80}`).join(" ")}
              fill="none"
              stroke="#7c6ba0"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Data points */}
            {data.map((item, idx) => (
              <circle
                key={idx}
                cx={(idx / (data.length - 1)) * 200}
                cy={100 - (item.value / max) * 80}
                r="2"
                fill="#7c6ba0"
              />
            ))}
          </svg>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.map((item, idx) => (
              <div key={idx} className="bg-canvas p-1.5 rounded">
                <div className="font-medium text-inksoft">{item.label}</div>
                <div className="font-semibold text-ink">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
