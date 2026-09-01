"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { AlertCircle, CheckCircle2, Activity } from "lucide-react";

interface HealthMetric {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical";
  value: string | number;
  threshold: string;
  lastChecked: string;
}

interface Service {
  id: string;
  name: string;
  status: "online" | "offline" | "degraded";
  uptime: string;
  responseTime: string;
  lastIncident?: string;
}

const MOCK_METRICS: HealthMetric[] = [
  { id: "m1", name: "API Response Time", status: "healthy", value: "124ms", threshold: "<500ms", lastChecked: "now" },
  { id: "m2", name: "Database Connection Pool", status: "healthy", value: "45/100", threshold: "<80", lastChecked: "now" },
  { id: "m3", name: "Cache Hit Rate", status: "warning", value: "72%", threshold: ">85%", lastChecked: "1m ago" },
  { id: "m4", name: "Error Rate", status: "healthy", value: "0.02%", threshold: "<1%", lastChecked: "now" },
  { id: "m5", name: "Memory Usage", status: "healthy", value: "62%", threshold: "<85%", lastChecked: "now" },
  { id: "m6", name: "Disk Space", status: "critical", value: "92%", threshold: "<90%", lastChecked: "now" },
];

const MOCK_SERVICES: Service[] = [
  { id: "s1", name: "API Server", status: "online", uptime: "99.98%", responseTime: "124ms" },
  { id: "s2", name: "Database", status: "online", uptime: "99.99%", responseTime: "45ms" },
  { id: "s3", name: "Cache (Redis)", status: "online", uptime: "99.95%", responseTime: "8ms" },
  { id: "s4", name: "Payment Gateway", status: "degraded", uptime: "99.50%", responseTime: "2500ms", lastIncident: "30m ago" },
  { id: "s5", name: "Email Service", status: "online", uptime: "99.97%", responseTime: "1200ms" },
];

export default function SuperAdminHealthPage() {
  const [metrics, setMetrics] = useState<HealthMetric[]>(MOCK_METRICS);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);

  const stats = {
    healthy: metrics.filter((m) => m.status === "healthy").length,
    warning: metrics.filter((m) => m.status === "warning").length,
    critical: metrics.filter((m) => m.status === "critical").length,
  };

  const serviceStats = {
    online: services.filter((s) => s.status === "online").length,
    degraded: services.filter((s) => s.status === "degraded").length,
    offline: services.filter((s) => s.status === "offline").length,
  };

  const getMetricStatusColor = (status: string) => {
    switch(status) {
      case "healthy": return "bg-sagebg text-sage";
      case "warning": return "bg-amber-50 text-amber-700";
      case "critical": return "bg-red-50 text-red-600";
      default: return "";
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch(status) {
      case "online": return "bg-sagebg text-sage";
      case "degraded": return "bg-amber-50 text-amber-700";
      case "offline": return "bg-red-50 text-red-600";
      default: return "";
    }
  };

  const statusIcon = (status: string) => {
    if (status === "healthy" || status === "online") return <CheckCircle2 size={14} />;
    if (status === "critical" || status === "offline") return <AlertCircle size={14} />;
    return <Activity size={14} />;
  };

  return (
    <div>
      <TopBar title="System Health" sub="Monitor platform performance and service status" />

      {/* System Metrics Overview */}
      <div className="px-5 grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        <StatCard label="Healthy" value={stats.healthy.toString()} sub={`of ${metrics.length} metrics`} />
        <StatCard label="Warnings" value={stats.warning.toString()} />
        <StatCard label="Critical" value={stats.critical.toString()} />
      </div>

      {/* Health Metrics */}
      <div className="section-label px-5">System Metrics</div>

      <div className="px-5 space-y-2 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-semibold text-sm">{metric.name}</div>
                  <Badge className={getMetricStatusColor(metric.status)}>
                    <span className="flex items-center gap-1">
                      {statusIcon(metric.status)}
                      {metric.status}
                    </span>
                  </Badge>
                </div>
                <div className="text-xs text-inksoft">
                  Threshold: {metric.threshold} • Last checked: {metric.lastChecked}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">{metric.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Services Status */}
      <div className="section-label px-5">Service Status</div>

      <div className="px-5 grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Online" value={serviceStats.online.toString()} />
        <StatCard label="Degraded" value={serviceStats.degraded.toString()} />
        <StatCard label="Offline" value={serviceStats.offline.toString()} />
      </div>

      <div className="px-5 space-y-2 mb-6">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="font-semibold text-sm">{service.name}</div>
                  <Badge className={getServiceStatusColor(service.status)}>
                    <span className="flex items-center gap-1">
                      {statusIcon(service.status)}
                      {service.status}
                    </span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold text-inksoft">Uptime</div>
                    <div className="text-sm font-semibold text-ink mt-0.5">{service.uptime}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-inksoft">Response Time</div>
                    <div className="text-sm font-semibold text-ink mt-0.5">{service.responseTime}</div>
                  </div>
                </div>

                {service.lastIncident && (
                  <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-700 p-2 rounded">
                    Last incident: {service.lastIncident}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Real-time Monitoring */}
      <div className="section-label px-5">Real-time Monitoring</div>

      <div className="px-5">
        <Card>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-semibold mb-2">API Load</div>
              <div className="w-full bg-canvas rounded-full h-2">
                <div className="bg-sage h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <div className="text-xs text-inksoft mt-1">Current: 65% • Peak: 78%</div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Database Load</div>
              <div className="w-full bg-canvas rounded-full h-2">
                <div className="bg-sage h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
              <div className="text-xs text-inksoft mt-1">Current: 45% • Peak: 62%</div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Network Traffic</div>
              <div className="w-full bg-canvas rounded-full h-2">
                <div className="bg-coral h-2 rounded-full" style={{ width: "82%" }}></div>
              </div>
              <div className="text-xs text-inksoft mt-1">Current: 82% • Peak: 85%</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
