import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";

export default function PlatformSettingsPage() {
  return (
    <div>
      <TopBar title="Platform settings" />
      <div className="px-5 flex flex-col gap-3">
        <Card>
          <div className="text-sm font-semibold mb-1">Slot length</div>
          <div className="text-xs text-inksoft">15 minutes (fixed for v1)</div>
        </Card>
        <Card>
          <div className="text-sm font-semibold mb-1">Payment provider</div>
          <div className="text-xs text-inksoft">Razorpay — UPI, card, wallet, net banking</div>
        </Card>
        <Card>
          <div className="text-sm font-semibold mb-1">Markets live</div>
          <div className="text-xs text-inksoft">Kochi, Bengaluru, Chennai, Hyderabad</div>
        </Card>
      </div>
    </div>
  );
}
