"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import { Search, Trash2, CheckCircle2, Eye } from "lucide-react";

interface Review {
  id: string;
  bookingId: string;
  reviewer: string;
  designer: string;
  rating: number;
  review: string;
  status: "published" | "flagged" | "removed";
  date: string;
  isAbusive: boolean;
}

const MOCK_REVIEWS: Review[] = [
  { id: "r1", bookingId: "b1", reviewer: "Arjun Patel", designer: "John Designer", rating: 5, review: "Excellent work! Very professional.", status: "published", date: "2024-01-15", isAbusive: false },
  { id: "r2", bookingId: "b2", reviewer: "Priya Kumar", designer: "Sarah Design", rating: 4, review: "Good service, quick turnaround.", status: "published", date: "2024-01-14", isAbusive: false },
  { id: "r3", bookingId: "b3", reviewer: "Rohit Singh", designer: "Mike Designer", rating: 1, review: "Terrible work, waste of money!", status: "flagged", date: "2024-01-13", isAbusive: true },
  { id: "r4", bookingId: "b4", reviewer: "Neha Sharma", designer: "Emma Design", rating: 3, review: "Average, could be better.", status: "published", date: "2024-01-12", isAbusive: false },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "flagged" | "removed">("all");
  const [action, setAction] = useState<string | null>(null);

  const filtered = reviews.filter((r) => {
    const matchSearch = r.reviewer.toLowerCase().includes(search.toLowerCase()) || 
                       r.designer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: reviews.length,
    published: reviews.filter((r) => r.status === "published").length,
    flagged: reviews.filter((r) => r.status === "flagged").length,
    removed: reviews.filter((r) => r.status === "removed").length,
  };

  const handleRemoveReview = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "removed" as const } : r)));
    setAction("Review removed");
    setTimeout(() => setAction(null), 2500);
  };

  const handlePublishReview = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "published" as const } : r)));
    setAction("Review published");
    setTimeout(() => setAction(null), 2500);
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const statusBgColor = (status: string) => {
    switch(status) {
      case "published": return "bg-sagebg text-sage";
      case "flagged": return "bg-amber-50 text-amber-700";
      case "removed": return "bg-red-50 text-red-600";
      default: return "";
    }
  };

  return (
    <div>
      <TopBar title="Reviews" sub="Moderate user reviews and ratings" />

      <div className="px-5 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total reviews" value={stats.total.toString()} />
        <StatCard label="Published" value={stats.published.toString()} />
        <StatCard label="Flagged" value={stats.flagged.toString()} />
        <StatCard label="Removed" value={stats.removed.toString()} />
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
            placeholder="Search by reviewer or designer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="flex gap-2 px-5 mb-4 overflow-x-auto">
        {(["all", "published", "flagged", "removed"] as const).map((tab) => (
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
        {filtered.map((r) => (
          <Card key={r.id}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="font-semibold text-sm">{r.reviewer} reviewed {r.designer}</div>
                <div className="text-xs text-inksoft mt-0.5">{r.date}</div>
              </div>
              <Badge className={statusBgColor(r.status)}>{r.status}</Badge>
            </div>

            <div className="text-xs mb-2">
              <span className="text-amber-500">{renderStars(r.rating)}</span>
              <span className="text-inksoft ml-2">({r.rating}/5)</span>
            </div>

            <div className="bg-canvas p-2 rounded-lg border border-line text-xs text-inksoft mb-3 italic">
              "{r.review}"
            </div>

            {r.isAbusive && (
              <div className="mb-2 text-xs bg-red-50 border border-red-200 text-red-600 p-2 rounded flex items-center gap-1.5">
                ⚠️ Flagged as potentially abusive
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-line/60">
              {r.status !== "published" && (
                <Button
                  variant="outline"
                  className="!px-3 !py-1.5 text-xs flex-1"
                  onClick={() => handlePublishReview(r.id)}
                >
                  Publish
                </Button>
              )}
              <Button
                className="!px-3 !py-1.5 text-xs border-red-200 text-red-600 hover:bg-red-50"
                variant="outline"
                onClick={() => handleRemoveReview(r.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-inksoft bg-white rounded-xl border border-line p-6">
            No reviews found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
