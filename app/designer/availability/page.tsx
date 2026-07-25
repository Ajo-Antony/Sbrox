import TopBar from "@/components/shared/TopBar";
import AvailabilityToggle from "@/components/designer/AvailabilityToggle";
import Card from "@/components/ui/Card";

export default function AvailabilityPage() {
  return (
    <div>
      <TopBar title="Availability" sub="Control when new bookings can reach you" />
      <div className="px-5 flex flex-col gap-3">
        <AvailabilityToggle />
        <Card>
          <div className="text-sm font-semibold mb-2">Working hours</div>
          <div className="text-xs text-inksoft">Mon–Sat · 9:00 AM – 8:00 PM</div>
        </Card>
      </div>
    </div>
  );
}
