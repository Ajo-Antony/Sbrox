import TopBar from "@/components/shared/TopBar";
import DesignerApprovalCard, { DesignerApplication } from "@/components/admin/DesignerApprovalCard";

const MOCK: DesignerApplication[] = [
  { id: "d_301", name: "Nikhil Pillai", category: "UI Design", submittedAgo: "2h ago", status: "pending_review" },
  { id: "d_300", name: "Meera Nair", category: "UI Design", submittedAgo: "3 weeks ago", status: "approved" },
  { id: "d_299", name: "Rakesh V.", category: "Photoshop", submittedAgo: "2 months ago", status: "suspended" }
];

export default function AdminDesignersPage() {
  return (
    <div>
      <TopBar title="Designers" sub="Review applications and manage active designers" />
      <div className="px-5 flex flex-col gap-3">
        {MOCK.map((d) => (
          <DesignerApprovalCard key={d.id} d={d} />
        ))}
      </div>
    </div>
  );
}
