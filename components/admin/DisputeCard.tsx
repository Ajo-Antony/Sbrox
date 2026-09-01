import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export interface DisputeData {
  id: string;
  user: string;
  designer: string;
  reason: string;
  status: "open" | "resolved";
  amount: number;
  createdAt: string;
}

interface DisputeCardProps {
  dispute: DisputeData;
  onRefund: (id: string) => void;
  onRelease: (id: string) => void;
}

export default function DisputeCard({ dispute, onRefund, onRelease }: DisputeCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-semibold text-[15px]">
            {dispute.user} <span className="text-xs text-inksoft font-normal">vs</span> {dispute.designer}
          </div>
          <Badge>{dispute.status}</Badge>
          <div className="text-xs text-inksoft mt-2 bg-canvas p-2 rounded-lg border border-line">
            <span className="font-semibold text-ink">Reason:</span> {dispute.reason}
          </div>
          <div className="text-xs text-inksoft mt-2">Amount: ₹{dispute.amount.toLocaleString()}</div>
        </div>
      </div>

      {dispute.status === "open" ? (
        <div className="flex gap-2 mt-3 pt-2 border-t border-line/60">
          <Button
            variant="outline"
            className="!px-3 !py-1.5 text-xs flex-1 border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => onRefund(dispute.id)}
          >
            Refund User
          </Button>
          <Button
            className="!px-3 !py-1.5 text-xs flex-1"
            onClick={() => onRelease(dispute.id)}
          >
            Release to Designer
          </Button>
        </div>
      ) : (
        <div className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
          ✓ Resolved
        </div>
      )}
    </Card>
  );
}
