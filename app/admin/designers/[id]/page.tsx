import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default async function AdminDesignerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <TopBar title="Nikhil Pillai" sub={`Application ${id}`} />
      <div className="px-5 flex flex-col gap-3">
        <Card>
          <div className="text-sm font-semibold mb-1">Category</div>
          <div className="text-xs text-inksoft">UI Design</div>
        </Card>
        <Card>
          <div className="text-sm font-semibold mb-1">Submitted rate</div>
          <div className="text-xs text-inksoft">₹449 per 15-minute slot</div>
        </Card>
        <Card>
          <div className="text-sm font-semibold mb-1">Portfolio</div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg"
                style={{ background: "linear-gradient(135deg,#B9A6E0,#6C4FB0)" }}
              />
            ))}
          </div>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            Reject
          </Button>
          <Button variant="sage" className="flex-1">
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
