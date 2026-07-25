"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import DesignerApprovalCard from "@/components/admin/DesignerApprovalCard";
import { getStoredDesigners, DesignerData } from "@/lib/store";

export default function AdminDesignersPage() {
  const [designers, setDesigners] = useState<DesignerData[]>([]);
  const [filter, setFilter] = useState<"all" | "pending_review" | "approved" | "suspended">("all");

  const refresh = () => {
    setDesigners(getStoredDesigners());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("quikdraw_data_changed", refresh);
    return () => window.removeEventListener("quikdraw_data_changed", refresh);
  }, []);

  const filtered = designers.filter((d) => {
    if (filter !== "all") return d.status === filter;
    return true;
  });

  return (
    <div>
      <TopBar title="Designers" sub="Review applications and manage active market designers" />

      {/* Filter Tabs */}
      <div className="flex gap-2 px-5 mb-4 overflow-x-auto">
        {(["all", "pending_review", "approved", "suspended"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize border ${
              filter === tab
                ? "bg-ink text-white border-ink"
                : "bg-white text-inksoft border-line"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((d) => (
          <DesignerApprovalCard
            key={d.id}
            d={{
              id: d.id,
              name: d.name,
              category: d.category,
              submittedAgo: d.submittedAgo || "Recently",
              status: d.status
            }}
          />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-inksoft bg-white rounded-xl border border-line p-6">
            No designers match this status filter.
          </div>
        )}
      </div>
    </div>
  );
}
