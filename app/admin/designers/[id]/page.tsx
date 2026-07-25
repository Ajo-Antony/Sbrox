"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";
import { getStoredDesigners, saveDesigners, DesignerData } from "@/lib/store";
import { Check, X, ShieldAlert } from "lucide-react";

export default function AdminDesignerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [designer, setDesigner] = useState<DesignerData | null>(null);
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    const designers = getStoredDesigners();
    const found = designers.find((d) => d.id === id) || {
      id,
      name: "Nikhil Pillai",
      headline: "UI Design Specialist",
      category: "UI Design",
      ratePer15: 449,
      distanceKm: 2.5,
      rating: 4.9,
      isAvailableNow: true,
      gradient: ["#B9A6E0", "#6C4FB0"],
      bio: "Product designer specializing in Figma component libraries and mobile UX.",
      badges: ["Figma", "UI Design", "iOS"],
      status: "pending_review",
      submittedAgo: "2h ago"
    };
    setDesigner(found as DesignerData);
  }, [id]);

  if (!designer) return null;

  const handleStatusChange = (newStatus: "approved" | "suspended") => {
    const all = getStoredDesigners();
    const updated = all.map((d) => (d.id === id ? { ...d, status: newStatus } : d));
    saveDesigners(updated);
    setActionDone(newStatus === "approved" ? "Approved" : "Suspended");
    setTimeout(() => {
      router.push("/admin/designers");
    }, 1200);
  };

  return (
    <div>
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <Link
          href="/admin/designers"
          className="w-[34px] h-[34px] rounded-full border border-line flex items-center justify-center font-bold bg-white"
        >
          ←
        </Link>
        <Badge>{designer.status.replace("_", " ")}</Badge>
      </div>

      <TopBar title={designer.name} sub={`Application ID: ${id}`} />

      {actionDone && (
        <div className="mx-5 mb-4 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-3 border border-sage/20 flex items-center gap-1.5">
          <Check size={14} /> Designer profile status updated to {actionDone}! Redirecting…
        </div>
      )}

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
        <Card>
          <div className="text-xs font-semibold text-inksoft mb-1">Full Name & Headline</div>
          <div className="font-semibold text-base">{designer.name}</div>
          <div className="text-xs text-coral font-medium mt-0.5">{designer.headline}</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-inksoft mb-1">Submitted Rate</div>
          <div className="font-display font-bold text-coraldark text-base">
            {formatINR(designer.ratePer15)} <span className="text-xs text-inksoft font-normal">per 15-minute slot</span>
          </div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-inksoft mb-1">Primary Category</div>
          <div className="text-sm font-semibold text-ink">{designer.category}</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-inksoft mb-1">Bio</div>
          <div className="text-xs text-ink mt-0.5 leading-relaxed">{designer.bio}</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-inksoft mb-2">Portfolio Showcase</div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-xl flex items-center justify-center text-[10px] font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${
                    i % 2 ? designer.gradient?.[1] : designer.gradient?.[0]
                  }, ${i % 2 ? designer.gradient?.[0] : designer.gradient?.[1]})`
                }}
              >
                Shot #{i + 1}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1 text-xs border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => handleStatusChange("suspended")}
          >
            Reject / Suspend
          </Button>
          <Button
            variant="sage"
            className="flex-1 text-xs shadow-sm"
            onClick={() => handleStatusChange("approved")}
          >
            Approve Profile →
          </Button>
        </div>
      </div>
    </div>
  );
}
