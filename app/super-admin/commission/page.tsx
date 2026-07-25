import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CommissionSlider from "@/components/super-admin/CommissionSlider";

export default function CommissionPage() {
  return (
    <div>
      <TopBar title="Commission" sub="Applies to every new booking platform-wide" />
      <div className="px-5 flex flex-col gap-4">
        <Card>
          <CommissionSlider />
        </Card>
        <Button variant="dark" className="w-full">
          Save
        </Button>
      </div>
    </div>
  );
}
