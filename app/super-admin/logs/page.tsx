"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Search, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  admin: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  status: "success" | "failed" | "pending";
  ipAddress: string;
}

const MOCK_LOGS: AuditLog[] = [
  {
    id: "l1",
    admin: "Raj Admin",
    action: "USER_BANNED",
    resource: "User: Neha Sharma (u4)",
    details: "User banned for abusive behavior",
    timestamp: "2024-01-15 14:32:45",
    status: "success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "l2",
    admin: "Priya Admin",
    action: "DESIGNER_APPROVED",
    resource: "Designer: John Designer (d1)",
    details: "Designer application approved",
    timestamp: "2024-01-15 13:15:20",
    status: "success",
    ipAddress: "192.168.1.101",
  },
  {
    id: "l3",
    admin: "Admin User",
    action: "DISPUTE_RESOLVED",
    resource: "Dispute: d123",
    details: "Dispute resolved - refund issued",
    timestamp: "2024-01-15 12:45:10",
    status: "success",
    ipAddress: "192.168.1.102",
  },
  {
    id: "l4",
    admin: "Raj Admin",
    action: "SETTING_CHANGED",
    resource: "Platform Settings",
    details: "Commission rate changed from 15% to 16%",
    timestamp: "2024-01-15 11:30:00",
    status: "success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "l5",
    admin: "Unknown Admin",
    action: "LOGIN_FAILED",
    resource: "Admin Panel",
    details: "Failed login attempt",
    timestamp: "2024-01-15 10:15:30",
    status: "failed",
    ipAddress: "203.0.113.50",
  },
];

export default function SuperAdminLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filtered = logs.filter((log) => {
    const matchSearch = 
      log.admin.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || log.status === filter;
    return matchSearch && matchFilter;
  });

  const getActionColor = (action: string) => {
    if (action.includes("BANNED") || action.includes("FAILED")) return "text-red-600";
    if (action.includes("APPROVED")) return "text-sage";
    if (action.includes("CHANGED")) return "text-amber-600";
    return "text-ink";
  };

  const statusBgColor = (status: string) => {
    switch(status) {
      case "success": return "bg-sagebg text-sage";
      case "failed": return "bg-red-50 text-red-600";
      case "pending": return "bg-amber-50 text-amber-700";
      default: return "";
    }
  };

  return (
    <div>
      <TopBar title="Audit Logs" sub="Track all admin actions and system changes" />

      <div className="px-5 mb-4 flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-inksoft" />
          <input
            type="text"
            placeholder="Search by admin, action, or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="flex gap-2 px-5 mb-4 overflow-x-auto">
        {(["all", "success", "failed"] as const).map((tab) => (
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
        {filtered.map((log) => (
          <Card
            key={log.id}
            className="cursor-pointer hover:border-ink/30 transition-colors"
            onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-xs font-semibold ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                  <Badge className={statusBgColor(log.status)}>{log.status}</Badge>
                </div>
                <div className="font-semibold text-sm">{log.resource}</div>
                <div className="text-xs text-inksoft mt-1">
                  by <span className="font-semibold">{log.admin}</span> • {log.timestamp}
                </div>
              </div>
              <Filter size={16} className="text-inksoft mt-1" />
            </div>

            {expandedLog === log.id && (
              <div className="mt-3 pt-3 border-t border-line/60">
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="font-semibold text-inksoft">Details:</div>
                    <div className="text-ink mt-1">{log.details}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-inksoft">IP Address:</div>
                      <div className="text-ink font-mono">{log.ipAddress}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-inksoft">Timestamp:</div>
                      <div className="text-ink">{log.timestamp}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-inksoft bg-white rounded-xl border border-line p-6">
            No audit logs found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
