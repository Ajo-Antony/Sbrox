import { listDesigners } from "@/lib/data";
import DesignerCard from "@/components/user/DesignerCard";
import CategoryChipsClient from "./category-chips-client";

export default async function BrowsePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "All" } = await searchParams;
  const designers = await listDesigners(category);

  return (
    <div>
      <div className="px-5 pt-6 pb-3">
        <div className="font-display font-semibold text-[22px] tracking-tight">
          Quik<span className="text-coral">draw</span>
        </div>
        <div className="flex items-center gap-1.5 text-inksoft text-[13px] mt-1.5">
          📍 Kochi, Kerala · within 5 km
        </div>
      </div>

      <div className="mx-5 mb-3.5 bg-white border border-line rounded-xl px-3.5 py-2.5 text-sm text-inksoft flex items-center gap-2">
        🔍 Search UI, redesign, Photoshop…
      </div>

      <CategoryChipsClient activeCategory={category} />

      <div className="section-label">Available in the next 15 min</div>
      <div className="px-5 flex flex-col gap-3">
        {designers?.map((d) => (
          <DesignerCard key={d.id} d={d} />
        ))}
        {designers?.length === 0 && (
          <div className="text-sm text-inksoft py-8 text-center">
            No one's free in this category right now — try another.
          </div>
        )}
      </div>
    </div>
  );
}
