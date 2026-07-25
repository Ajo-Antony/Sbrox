import Link from "next/link";
import { notFound } from "next/navigation";
import { getDesigner } from "@/lib/data";
import Badge from "@/components/ui/Badge";
import TimerRing from "@/components/user/TimerRing";
import { formatINR } from "@/lib/utils";

export default async function DesignerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = await getDesigner(id);
  if (!d) notFound();

  return (
    <div>
      <div
        className="h-[170px] relative"
        style={{ background: `linear-gradient(135deg, ${d.gradient[0]}, ${d.gradient[1]})` }}
      >
        <Link
          href="/user/browse"
          className="absolute top-4 left-4 w-[34px] h-[34px] rounded-full bg-white/90 flex items-center justify-center font-bold"
        >
          ←
        </Link>
      </div>

      <div className="-mt-6 bg-canvas rounded-t-xl3 relative p-5">
        <div className="font-display font-semibold text-2xl">{d.name}</div>
        <div className="text-inksoft text-[13px] mt-0.5">
          {d.bio} · {d.distanceKm} km away
        </div>

        <div className="flex gap-2 flex-wrap my-3.5">
          {d.badges.map((b) => (
            <Badge key={b}>{b}</Badge>
          ))}
        </div>

        <div className="section-label !px-0">Recent work</div>
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-24 h-24 rounded-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${
                  i % 2 ? d.gradient[1] : d.gradient[0]
                }, ${i % 2 ? d.gradient[0] : d.gradient[1]})`
              }}
            />
          ))}
        </div>

        <div className="h-px bg-line my-4" />

        <Link
          href={`/user/booking/${d.id}`}
          className="flex items-center gap-3.5 bg-ink text-white rounded-xl2 px-4 py-3.5"
        >
          <TimerRing />
          <div className="flex-1">
            <div className="font-semibold text-[15px]">Book instant 15-min slot</div>
            <div className="text-xs text-[#C9C4B8] mt-0.5">
              {formatINR(d.ratePer15)}/15min · pay after the call
            </div>
          </div>
          <div>→</div>
        </Link>
      </div>
    </div>
  );
}
