"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getStoredDisputes, saveDisputes, DisputeData } from "@/lib/store";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeData[]>([]);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const refresh = () => {
    setDisputes(getStoredDisputes());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("quikdraw_data_changed", refresh);
    return () => window.removeEventListener("quikdraw_data_changed", refresh);
  }, []);

  const handleResolve = (id: string, resolution: "Refunded" | "Released") => {
    const updated = disputes.map((d) => (d.id === id ? { ...d, status: resolution } : d));
    saveDisputes(updated);
    setDisputes(updated);
    setActionDone(`Dispute ${id} resolved: ${resolution}`);
    setTimeout(() => setActionDone(null), 2500);
  };

  return (
    <div>
      <TopBar title="Disputes" sub="Resolve customer payment & attendance conflicts" />

      {actionDone && (
        <div className="mx-5 mb-3 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2.5 border border-sage/20 flex items-center gap-1.5">
          <CheckCircle2 size={14} /> {actionDone}
        </div>
      )}

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {disputes.map((d) => (
          <Card key={d.id}>
            <div className="flex justify-between items-start">
              <div className="font-semibold text-[15px]">
                {d.user} <span className="text-xs text-inksoft font-normal">vs</span> {d.designer}
              </div>
              <Badge>{d.status}</Badge>
            </div>
            <div className="text-xs text-inksoft mt-1.5 bg-canvas p-2 rounded-lg border border-line">
              <span className="font-semibold text-ink">Reason:</span> {d.reason}
            </div>

            {d.status === "Open" ? (
              <div className="flex gap-2 mt-3 pt-2 border-t border-line/60">
                <Button
                  variant="outline"
                  className="!px-3 !py-1.5 text-xs flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleResolve(d.id, "Refunded")}
                >
                  Refund User
                </Button>
                <Button
                  variant="sage"
                  className="!px-3 !py-1.5 text-xs flex-1"
                  onClick={() => handleResolve(d.id, "Released")}
                >
                  Release to Designer
                </Button>
              </div>
            ) : (
              <div className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                ✓ Resolved as {d.status}
              </div>
            )}
          </Card>
        ))}

        {disputes.length === 0 && (
          <div className="text-center py-10 text-xs text-inksoft bg-white rounded-xl border border-line p-6">
            No active disputes logged in your market!
          </div>
        )}
      </div>
    </div>
  );
}
