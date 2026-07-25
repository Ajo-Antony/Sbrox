"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";
import { getStoredBookings, getStoredDesigners, getStoredDisputes } from "@/lib/store";
import Link from "next/link";
import { ArrowRight, Shield, AlertTriangle, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const [bookingCount, setBookingCount] = useState(0);
  const [gmvToday, setGmvToday] = useState(0);
  const [pendingApps, setPendingApps] = useState(0);
  const [openDisputes, setOpenDisputes] = useState(0);

  const refresh = () => {
    const bookings = getStoredBookings();
    setBookingCount(bookings.length);
    const totalSum = bookings.reduce((acc, curr) => acc + curr.total, 0);
    setGmvToday(totalSum || 42300);

    const designers = getStoredDesigners();
    setPendingApps(designers.filter((d) => d.status === "pending_review").length);

    const disputes = getStoredDisputes();
    setOpenDisputes(disputes.filter((d) => d.status === "Open").length);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("quikdraw_data_changed", refresh);
    return () => window.removeEventListener("quikdraw_data_changed", refresh);
  }, []);

  return (
    <div>
      <TopBar title="Overview" sub="Kochi Market Admin Console" />

      <div className="px-5 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Live bookings" value={bookingCount.toString()} sub="across local market" />
        <StatCard label="GMV total" value={formatINR(gmvToday)} sub="Gross booking volume" />
        <StatCard label="Pending applications" value={pendingApps.toString()} sub="Designers awaiting review" />
        <StatCard label="Open disputes" value={openDisputes.toString()} sub="Action required" />
      </div>

      <div className="section-label">Quick actions</div>
      <div className="px-5 flex flex-col gap-2.5">
        <Link href="/admin/designers">
          <Card className="flex items-center justify-between hover:border-coral transition-colors">
            <div className="flex items-center gap-2.5">
              <Users size={18} className="text-coral" />
              <div>
                <div className="font-semibold text-sm">Review Designer Applications ({pendingApps})</div>
                <div className="text-xs text-inksoft">Approve or suspend designer profiles</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-inksoft" />
          </Card>
        </Link>

        <Link href="/admin/disputes">
          <Card className="flex items-center justify-between hover:border-coral transition-colors">
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={18} className="text-amber-600" />
              <div>
                <div className="font-semibold text-sm">Manage Disputes ({openDisputes})</div>
                <div className="text-xs text-inksoft">Refund users or release funds</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-inksoft" />
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="flex items-center justify-between hover:border-coral transition-colors">
            <div className="flex items-center gap-2.5">
              <Shield size={18} className="text-sage" />
              <div>
                <div className="font-semibold text-sm">Manage Browse Categories</div>
                <div className="text-xs text-inksoft">Edit UI Design, Photoshop, etc.</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-inksoft" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
