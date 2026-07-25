import Link from "next/link";
import { formatINR } from "@/lib/utils";

export interface DesignerCardData {
  id: string;
  name: string;
  headline: string;
  ratePer15: number;
  distanceKm: number;
  rating: number;
  isAvailableNow: boolean;
  gradient: [string, string];
}

export default function DesignerCard({ d }: { d: DesignerCardData }) {
  return (
    <Link href={`/user/designer/${d.id}`} className="block">
      <div className="bg-white border border-line rounded-xl2 p-3.5 flex gap-3 active:scale-[0.98] transition-transform">
        <div
          className="w-16 h-16 rounded-xl2 flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${d.gradient[0]}, ${d.gradient[1]})` }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-1.5">
            <div className="font-semibold text-[15px]">{d.name}</div>
            <div className="font-display font-semibold text-[15px] text-coraldark whitespace-nowrap">
              {formatINR(d.ratePer15)}/15min
            </div>
          </div>
          <div className="text-xs text-inksoft mt-0.5">{d.headline}</div>
          <div className="flex items-center gap-2.5 mt-2 text-xs text-inksoft">
            {d.isAvailableNow && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" /> Free in 15 min
              </>
            )}
            <span>· {d.distanceKm} km</span>
            <span className="text-gold font-semibold">★ {d.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
