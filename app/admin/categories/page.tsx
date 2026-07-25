import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/constants";

export default function AdminCategoriesPage() {
  return (
    <div>
      <TopBar title="Categories" sub="Shown as filter chips on Browse" />
      <div className="px-5 flex flex-col gap-3 mb-5">
        {CATEGORIES.map((c) => (
          <Card key={c} className="flex justify-between items-center">
            <div className="font-semibold text-sm">{c}</div>
            <Button variant="outline" className="!px-3 !py-1.5 text-xs">
              Edit
            </Button>
          </Card>
        ))}
      </div>
      <div className="px-5">
        <Button variant="dark" className="w-full">
          Add category
        </Button>
      </div>
    </div>
  );
}
