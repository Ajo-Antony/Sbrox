"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getStoredAdmins, saveAdmins, MarketAdminData } from "@/lib/store";
import { Plus, UserCheck, Trash2, Check } from "lucide-react";

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<MarketAdminData[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [market, setMarket] = useState("Kochi");
  const [notice, setNotice] = useState("");

  const refresh = () => {
    setAdmins(getStoredAdmins());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("quikdraw_data_changed", refresh);
    return () => window.removeEventListener("quikdraw_data_changed", refresh);
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const newAdmin: MarketAdminData = {
      id: `adm_${Date.now().toString().slice(-4)}`,
      name,
      email,
      market,
      role: "Market admin"
    };
    const updated = [newAdmin, ...admins];
    saveAdmins(updated);
    setAdmins(updated);
    setName("");
    setEmail("");
    setShowInviteModal(false);
    setNotice(`Invitation sent to ${newAdmin.name} for ${newAdmin.market}!`);
    setTimeout(() => setNotice(""), 2500);
  };

  const handleRemove = (id: string) => {
    const updated = admins.filter((a) => a.id !== id);
    saveAdmins(updated);
    setAdmins(updated);
  };

  return (
    <div>
      <TopBar title="Market Admins" sub="Manage local moderators across city hubs" />

      {notice && (
        <div className="mx-5 mb-3 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2 border border-sage/20 flex items-center gap-1.5">
          <Check size={14} /> {notice}
        </div>
      )}

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {admins.map((a) => (
          <Card key={a.id} className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-[15px]">{a.name}</div>
              <div className="text-xs text-coral font-medium mt-0.5">
                📍 {a.market} · {a.email}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{a.role}</Badge>
              <button
                onClick={() => handleRemove(a.id)}
                className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                title="Revoke Admin Access"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="px-5">
        <Button
          variant="dark"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowInviteModal(true)}
        >
          <Plus size={16} /> Invite new market admin
        </Button>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-canvas text-ink w-full max-w-sm rounded-2xl p-5 border border-line shadow-2xl">
            <div className="font-display font-semibold text-lg mb-1">Invite Market Admin</div>
            <div className="text-xs text-inksoft mb-4">
              Grant city-level admin permissions to review designers and disputes.
            </div>

            <form onSubmit={handleInvite} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-inksoft block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Varma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-line rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="font-semibold text-inksoft block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sneha@quikdraw.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-line rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="font-semibold text-inksoft block mb-1">Assigned City Market</label>
                <select
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  className="w-full border border-line rounded-xl px-3.5 py-2.5 bg-white font-semibold focus:outline-none focus:border-coral"
                >
                  <option value="Kochi">Kochi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi NCR</option>
                </select>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
