import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function UserProfilePage() {
  return (
    <div>
      <TopBar title="Profile" />
      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <Card className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-sagebg flex items-center justify-center font-display font-semibold text-lg text-sage">
            A
          </div>
          <div>
            <div className="font-semibold text-[15px]">Your account</div>
            <div className="text-xs text-inksoft mt-0.5">Kochi, Kerala</div>
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold mb-2">Saved payment methods</div>
          <div className="text-xs text-inksoft">UPI, Card on file</div>
        </Card>
        <Button variant="outline" className="w-full">
          Sign out
        </Button>
      </div>
    </div>
  );
}
