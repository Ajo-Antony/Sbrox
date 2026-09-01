"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import { Search, Ban, CheckCircle2, Eye } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: number;
  status: "active" | "banned" | "pending";
  joinedAt: string;
  totalSpent: number;
}

const MOCK_USERS: User[] = [
  { id: "u1", name: "Arjun Patel", email: "arjun@example.com", phone: "+91 98765 43210", bookings: 12, status: "active", joinedAt: "2024-01-15", totalSpent: 45000 },
  { id: "u2", name: "Priya Kumar", email: "priya@example.com", phone: "+91 87654 32109", bookings: 8, status: "active", joinedAt: "2024-02-20", totalSpent: 32000 },
  { id: "u3", name: "Rohit Singh", email: "rohit@example.com", phone: "+91 76543 21098", bookings: 0, status: "pending", joinedAt: "2024-03-01", totalSpent: 0 },
  { id: "u4", name: "Neha Sharma", email: "neha@example.com", phone: "+91 65432 10987", bookings: 5, status: "banned", joinedAt: "2024-01-10", totalSpent: 18000 },
  { id: "u5", name: "Vikram Desai", email: "vikram@example.com", phone: "+91 54321 09876", bookings: 15, status: "active", joinedAt: "2023-12-05", totalSpent: 62000 },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "banned">("all");
  const [action, setAction] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const handleBanUser = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: "banned" as const } : u)));
    setAction(`User banned successfully`);
    setTimeout(() => setAction(null), 2500);
  };

  const handleUnbanUser = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: "active" as const } : u)));
    setAction(`User unbanned successfully`);
    setTimeout(() => setAction(null), 2500);
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    banned: users.filter((u) => u.status === "banned").length,
  };

  return (
    <div>
      <TopBar title="Users" sub="Manage user accounts and permissions" />

      <div className="px-5 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total users" value={stats.total.toString()} />
        <StatCard label="Active" value={stats.active.toString()} />
        <StatCard label="Pending" value={stats.pending.toString()} />
        <StatCard label="Banned" value={stats.banned.toString()} />
      </div>

      {action && (
        <div className="mx-5 mb-3 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2.5 border border-sage/20 flex items-center gap-1.5">
          <CheckCircle2 size={14} /> {action}
        </div>
      )}

      <div className="px-5 mb-4 flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-inksoft" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="flex gap-2 px-5 mb-4 overflow-x-auto">
        {(["all", "active", "pending", "banned"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize border ${
              filter === tab
                ? "bg-ink text-white border-ink"
                : "bg-white text-inksoft border-line"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-2">
        {filtered.map((u) => (
          <Card key={u.id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-sm">{u.name}</div>
                <div className="text-xs text-inksoft mt-0.5">{u.email} • {u.phone}</div>
                <div className="text-xs text-inksoft mt-1">
                  {u.bookings} bookings • ₹{u.totalSpent.toLocaleString()} total spent
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge>{u.status}</Badge>
                <button className="p-2 hover:bg-canvas rounded-lg transition-colors">
                  <Eye size={16} className="text-inksoft" />
                </button>
                {u.status === "banned" ? (
                  <Button
                    variant="outline"
                    className="!px-2 !py-1 text-xs"
                    onClick={() => handleUnbanUser(u.id)}
                  >
                    Unban
                  </Button>
                ) : (
                  <Button
                    className="!px-2 !py-1 text-xs border-red-200 text-red-600 hover:bg-red-50"
                    variant="outline"
                    onClick={() => handleBanUser(u.id)}
                  >
                    <Ban size={14} />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-inksoft bg-white rounded-xl border border-line p-6">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
