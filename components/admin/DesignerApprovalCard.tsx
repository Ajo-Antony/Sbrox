import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface DesignerApplication {
  id: string;
  name: string;
  category: string;
  submittedAgo: string;
  status: "pending_review" | "approved" | "suspended";
}

export default function DesignerApprovalCard({ d }: { d: DesignerApplication }) {
  return (
    <Link href={`/admin/designers/${d.id}`}>
      <Card className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-[15px]">{d.name}</div>
          <div className="text-xs text-inksoft mt-0.5">
            {d.category} · applied {d.submittedAgo}
          </div>
        </div>
        <Badge>{d.status.replace("_", " ")}</Badge>
      </Card>
    </Link>
  );
}
