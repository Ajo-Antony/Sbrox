"use client";

import { useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Check, Globe, Shield, CreditCard, Clock } from "lucide-react";

export default function PlatformSettingsPage() {
  const [cities, setCities] = useState([
    { name: "Kochi", active: true },
    { name: "Bengaluru", active: true },
    { name: "Chennai", active: true },
    { name: "Hyderabad", active: true },
    { name: "Mumbai", active: false },
    { name: "Delhi NCR", active: false }
  ]);
  const [autoApprove, setAutoApprove] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleCity = (cityName: string) => {
    setCities(
      cities.map((c) => (c.name === cityName ? { ...c, active: !c.active } : c))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <TopBar title="Platform Settings" sub="Global configurations and active market controls" />

      {saved && (
        <div className="mx-5 mb-3 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2 border border-sage/20 flex items-center gap-1.5">
          <Check size={14} /> Platform configuration saved!
        </div>
      )}

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold mb-1 text-ink">
            <Clock size={16} className="text-coral" /> Slot Length Policy
          </div>
          <div className="text-xs text-inksoft">
            15 minutes per instant session (Optimized for fast feedback & micro-consultations).
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold mb-1 text-ink">
            <CreditCard size={16} className="text-coral" /> Payment Gateway Integration
          </div>
          <div className="text-xs text-inksoft">
            Razorpay Enabled — Supporting UPI Instant Auto-Pay, Credit/Debit Cards, NetBanking.
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold mb-2 text-ink">
            <Globe size={16} className="text-coral" /> Active City Hubs
          </div>
          <div className="grid grid-cols-2 gap-2">
            {cities.map((c) => (
              <button
                key={c.name}
                onClick={() => toggleCity(c.name)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                  c.active
                    ? "bg-sagebg text-sage border-sage/30"
                    : "bg-white text-inksoft border-line"
                }`}
              >
                <span>📍 {c.name}</span>
                <span>{c.active ? "ON" : "OFF"}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-sm">Auto-Approve Designers</div>
              <div className="text-xs text-inksoft mt-0.5">Bypass manual market admin review</div>
            </div>
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="accent-coral w-4 h-4 cursor-pointer"
            />
          </div>
        </Card>

        <Button variant="dark" className="w-full mt-2 shadow-md" onClick={handleSave}>
          Save Platform Settings
        </Button>
      </div>
    </div>
  );
}
