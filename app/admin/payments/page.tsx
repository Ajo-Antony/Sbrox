"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import { Search, Download, CheckCircle2 } from "lucide-react";

interface Transaction {
  id: string;
  bookingId: string;
  user: string;
  designer: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  method: string;
  date: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", bookingId: "b1", user: "Arjun Patel", designer: "John Designer", amount: 5000, status: "completed", method: "UPI", date: "2024-01-15" },
  { id: "t2", bookingId: "b2", user: "Priya Kumar", designer: "Sarah Design", amount: 4500, status: "completed", method: "Card", date: "2024-01-14" },
  { id: "t3", bookingId: "b3", user: "Rohit Singh", designer: "Mike Designer", amount: 6000, status: "pending", method: "Wallet", date: "2024-01-13" },
  { id: "t4", bookingId: "b4", user: "Neha Sharma", designer: "Emma Design", amount: 3500, status: "failed", method: "Card", date: "2024-01-12" },
  { id: "t5", bookingId: "b5", user: "Vikram Desai", designer: "Alex Designer", amount: 5500, status: "refunded", method: "UPI", date: "2024-01-11" },
];

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "failed" | "refunded">("all");
  const [action, setAction] = useState<string | null>(null);

  const filtered = transactions.filter((t) => {
    const matchSearch = t.user.toLowerCase().includes(search.toLowerCase()) || 
                       t.designer.toLowerCase().includes(search.toLowerCase()) ||
                       t.id.includes(search);
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === "completed").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    failed: transactions.filter((t) => t.status === "failed").length,
  };

  const handleExport = () => {
    setAction("Transactions exported as CSV");
    setTimeout(() => setAction(null), 2500);
  };

  const handleRetry = (id: string) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, status: "completed" as const } : t)));
    setAction(`Transaction ${id} retried successfully`);
    setTimeout(() => setAction(null), 2500);
  };

  const statusBgColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-sagebg text-sage";
      case "pending": return "bg-amber-50 text-amber-700";
      case "failed": return "bg-red-50 text-red-600";
      case "refunded": return "bg-blue-50 text-blue-600";
      default: return "";
    }
  };

  return (
    <div>
      <TopBar title="Payments" sub="Monitor and manage transactions" />

      <div className="px-5 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total transactions" value={stats.total.toString()} />
        <StatCard label="Completed" value={stats.completed.toString()} />
        <StatCard label="Pending" value={stats.pending.toString()} />
        <StatCard label="Failed" value={stats.failed.toString()} />
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
            placeholder="Search by user, designer, or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-ink"
          />
        </div>
        <Button
          className="!px-4 text-xs flex items-center gap-2"
          onClick={handleExport}
        >
          <Download size={14} /> Export
        </Button>
      </div>

      <div className="flex gap-2 px-5 mb-4 overflow-x-auto">
        {(["all", "completed", "pending", "failed", "refunded"] as const).map((tab) => (
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
        {filtered.map((t) => (
          <Card key={t.id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-sm">{t.user} → {t.designer}</div>
                <div className="text-xs text-inksoft mt-0.5">ID: {t.id} • {t.date}</div>
                <div className="text-xs text-inksoft mt-1">Method: {t.method}</div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div className="font-semibold text-sm">₹{t.amount.toLocaleString()}</div>
                  <Badge className={statusBgColor(t.status)}>{t.status}</Badge>
                </div>
                {t.status === "failed" && (
                  <Button
                    variant="outline"
                    className="!px-3 !py-1 text-xs"
                    onClick={() => handleRetry(t.id)}
                  >
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-inksoft bg-white rounded-xl border border-line p-6">
            No transactions found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
