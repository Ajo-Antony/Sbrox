import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";

const BY_CITY = [
  { city: "Kochi", gmv: 412000, bookings: 1840 },
  { city: "Bengaluru", gmv: 528000, bookings: 2210 },
  { city: "Chennai", gmv: 198000, bookings: 940 },
  { city: "Hyderabad", gmv: 146000, bookings: 710 }
];

export default function AnalyticsPage() {
  return (
    <div>
      <TopBar title="Analytics" sub="GMV by market, last 30 days" />
      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {BY_CITY.map((c) => (
          <Card key={c.city} className="flex justify-between items-center">
            <div className="font-semibold text-sm">{c.city}</div>
            <div className="text-right">
              <div className="font-display font-semibold text-coraldark">{formatINR(c.gmv)}</div>
              <div className="text-xs text-inksoft">{c.bookings} bookings</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
