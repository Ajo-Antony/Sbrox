import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function DesignerProfilePage() {
  return (
    <div>
      <TopBar title="Your profile" sub="What users see on your booking page" />
      <div className="px-5 flex flex-col gap-3">
        <Card>
          <div className="font-semibold text-[15px]">Meera Nair</div>
          <div className="text-xs text-inksoft mt-1">
            Product designer specialising in fintech and SaaS dashboards.
          </div>
          <div className="flex gap-2 flex-wrap mt-3">
            <Badge>UI design</Badge>
            <Badge>Design systems</Badge>
            <Badge>Figma</Badge>
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold mb-2">Rate</div>
          <div className="text-xs text-inksoft">₹499 per 15-minute slot</div>
        </Card>
        <Button variant="outline" className="w-full">
          Edit profile
        </Button>
      </div>
    </div>
  );
}
