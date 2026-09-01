import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Eye, Ban } from "lucide-react";

export interface UserData {
  id: string;
  name: string;
  email: string;
  bookings: number;
  status: "active" | "banned" | "pending";
  totalSpent: number;
}

interface UserTableProps {
  users: UserData[];
  onViewDetails: (id: string) => void;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
}

export default function UserTable({ users, onViewDetails, onBan, onUnban }: UserTableProps) {
  return (
    <div className="space-y-2">
      {users.map((user) => (
        <Card key={user.id}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-sm">{user.name}</div>
              <div className="text-xs text-inksoft mt-0.5">{user.email}</div>
              <div className="text-xs text-inksoft mt-1">
                {user.bookings} bookings • ₹{user.totalSpent.toLocaleString()} spent
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge>{user.status}</Badge>
              <button
                onClick={() => onViewDetails(user.id)}
                className="p-2 hover:bg-canvas rounded-lg transition-colors"
              >
                <Eye size={16} className="text-inksoft" />
              </button>
              {user.status === "banned" ? (
                <Button
                  variant="outline"
                  className="!px-2 !py-1 text-xs"
                  onClick={() => onUnban(user.id)}
                >
                  Unban
                </Button>
              ) : (
                <Button
                  className="!px-2 !py-1 text-xs border-red-200 text-red-600 hover:bg-red-50"
                  variant="outline"
                  onClick={() => onBan(user.id)}
                >
                  <Ban size={14} />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
