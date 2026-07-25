"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";
import { getStoredCommission, getStoredBookings } from "@/lib/store";
import { ArrowDownRight, CheckCircle2, DollarSign } from "lucide-react";

export default function EarningsPage() {
  const [commission, setCommission] = useState(15);
  const [payouts, setPayouts] = useState([
    { id: "po_1", date: "Jul 22, 2026", amount: 4235, status: "Paid via UPI" },
    { id: "po_2", date: "Jul 15, 2026", amount: 3810, status: "Paid via UPI" }
  ]);
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutUpi, setPayoutUpi] = useState("meera@upi");
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setCommission(getStoredCommission());
  }, []);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayout = {
      id: `po_${Date.now().toString().slice(-4)}`,
      date: "Today (Processing)",
      amount: 1847,
      status: "Processing"
    };
    setPayouts([newPayout, ...payouts]);
    setRequested(true);
    setTimeout(() => {
      setRequested(false);
      setPayoutModal(false);
    }, 1500);
  };

  return (
    <div>
      <TopBar title="Earnings" sub={`Platform commission: ${commission}% per booking`} />

      <div className="px-5 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="This week" value={formatINR(6120)} sub="18 completed calls" />
        <StatCard label="Lifetime" value={formatINR(48210)} sub="142 calls total" />
      </div>

      {/* Available for Withdrawal */}
      <div className="px-5 mb-5">
        <Card className="bg-gradient-to-r from-ink to-[#2E2A24] text-white p-4 shadow-lg border-0">
          <div className="text-xs text-[#C9C4B8] font-semibold mb-1">Available for payout</div>
          <div className="flex justify-between items-baseline">
            <div className="font-display font-bold text-2xl text-emerald-400">{formatINR(1847)}</div>
            <Button
              variant="sage"
              className="!px-3.5 !py-1.5 text-xs shadow-sm"
              onClick={() => setPayoutModal(true)}
            >
              Withdraw to UPI →
            </Button>
          </div>
        </Card>
      </div>

      <div className="section-label">Payout history</div>
      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {payouts.map((p) => (
          <Card key={p.id} className="flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold">{p.date}</div>
              <div className="text-xs text-inksoft mt-0.5">{p.status}</div>
            </div>
            <div className="font-display font-semibold text-coraldark text-base">
              {formatINR(p.amount)}
            </div>
          </Card>
        ))}
      </div>

      {/* Payout Request Modal */}
      {payoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-canvas text-ink w-full max-w-sm rounded-2xl p-5 border border-line shadow-2xl">
            {!requested ? (
              <>
                <div className="font-display font-semibold text-lg mb-1">Request UPI Payout</div>
                <div className="text-xs text-inksoft mb-4">
                  Withdraw your net earnings ({formatINR(1847)}) after {commission}% platform fee deduction.
                </div>

                <form onSubmit={handleRequestPayout} className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-inksoft block mb-1">UPI ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. yourname@upi"
                      value={payoutUpi}
                      onChange={(e) => setPayoutUpi(e.target.value)}
                      className="w-full border border-line rounded-xl px-3 py-2.5 bg-white text-xs font-semibold focus:outline-none focus:border-coral"
                    />
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setPayoutModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1">
                      Confirm Withdrawal
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-2" />
                <div className="font-display font-semibold text-base">Payout Submitted!</div>
                <div className="text-xs text-inksoft mt-1">
                  ₹1,847 will be credited to {payoutUpi} within 2 hours.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
