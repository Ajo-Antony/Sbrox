import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface DesignerData {
  id: string;
  name: string;
  category: string;
  rating: number;
  bookings: number;
  status: "approved" | "pending_review" | "suspended";
  joinedAt: string;
}

interface DesignerTableProps {
  designers: DesignerData[];
  onSelectDesigner: (id: string) => void;
}

export default function DesignerTable({ designers, onSelectDesigner }: DesignerTableProps) {
  const statusBgColor = (status: string) => {
    switch(status) {
      case "approved": return "bg-sagebg text-sage";
      case "pending_review": return "bg-amber-50 text-amber-700";
      case "suspended": return "bg-red-50 text-red-600";
      default: return "";
    }
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  };

  return (
    <div className="space-y-2">
      {designers.map((designer) => (
        <Card
          key={designer.id}
          className="cursor-pointer hover:border-ink/30 transition-colors"
          onClick={() => onSelectDesigner(designer.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-sm">{designer.name}</div>
              <div className="text-xs text-inksoft mt-0.5">{designer.category}</div>
              <div className="text-xs text-amber-500 mt-1">{renderStars(designer.rating)}</div>
              <div className="text-xs text-inksoft mt-0.5">Joined {designer.joinedAt}</div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <div className="font-semibold text-sm">{designer.bookings}</div>
                <div className="text-xs text-inksoft">bookings</div>
                <Badge className={statusBgColor(designer.status)}>
                  {designer.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
