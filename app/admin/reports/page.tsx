"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Download, Calendar, CheckCircle2 } from "lucide-react";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  format: string;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "r1",
    name: "Revenue Report",
    description: "Daily, weekly, and monthly revenue breakdowns",
    metrics: ["Total GMV", "Commission earned", "Payment methods", "Top designers", "Trends"],
    format: "PDF, CSV"
  },
  {
    id: "r2",
    name: "User Activity Report",
    description: "User engagement and booking patterns",
    metrics: ["Active users", "New signups", "Booking counts", "Repeat users", "Churn rate"],
    format: "PDF, CSV"
  },
  {
    id: "r3",
    name: "Designer Performance",
    description: "Designer metrics and quality indicators",
    metrics: ["Booking count", "Avg rating", "Response time", "Completion rate", "Revenue"],
    format: "PDF, CSV"
  },
  {
    id: "r4",
    name: "Dispute Report",
    description: "Dispute resolutions and trends",
    metrics: ["Total disputes", "Resolution rate", "Avg resolution time", "Categories", "Outcomes"],
    format: "PDF, CSV"
  },
];

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-31");
  const [action, setAction] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<{ id: string; name: string; date: string }[]>([
    { id: "gr1", name: "Revenue Report Jan 2024", date: "2024-01-31" },
    { id: "gr2", name: "User Activity Report Jan 2024", date: "2024-01-30" },
  ]);

  const handleGenerateReport = (templateId: string, format: "PDF" | "CSV") => {
    const template = REPORT_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      const newReport = {
        id: `gr${Date.now()}`,
        name: `${template.name} (${format}) - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString().split("T")[0],
      };
      setGeneratedReports([newReport, ...generatedReports]);
      setAction(`${template.name} generated as ${format}`);
      setTimeout(() => setAction(null), 2500);
    }
  };

  const handleDownload = (id: string) => {
    setAction("Report downloading...");
    setTimeout(() => setAction(null), 2500);
  };

  return (
    <div>
      <TopBar title="Reports" sub="Generate business analytics and export data" />

      {action && (
        <div className="mx-5 mb-3 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2.5 border border-sage/20 flex items-center gap-1.5">
          <CheckCircle2 size={14} /> {action}
        </div>
      )}

      <div className="px-5 mb-5">
        <div className="bg-white rounded-lg border border-line p-4">
          <div className="text-sm font-semibold mb-3">Select Date Range</div>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs text-inksoft block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-ink"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-inksoft block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-ink"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="section-label px-5">Available Reports</div>

      <div className="px-5 space-y-3 mb-6">
        {REPORT_TEMPLATES.map((template) => (
          <Card key={template.id}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-sm">{template.name}</div>
                <div className="text-xs text-inksoft mt-1">{template.description}</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs font-semibold text-inksoft mb-2">Metrics included:</div>
              <div className="flex flex-wrap gap-1.5">
                {template.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="text-xs bg-canvas text-ink px-2 py-1 rounded border border-line"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-line/60">
              <Button
                variant="outline"
                className="!px-3 !py-1.5 text-xs flex-1"
                onClick={() => handleGenerateReport(template.id, "PDF")}
              >
                Generate PDF
              </Button>
              <Button
                className="!px-3 !py-1.5 text-xs flex-1"
                onClick={() => handleGenerateReport(template.id, "CSV")}
              >
                Generate CSV
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="section-label px-5">Recent Reports</div>

      <div className="px-5 space-y-2">
        {generatedReports.map((report) => (
          <Card key={report.id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-sm">{report.name}</div>
                <div className="text-xs text-inksoft mt-0.5">{report.date}</div>
              </div>
              <Button
                variant="outline"
                className="!px-3 !py-1.5 text-xs flex items-center gap-1.5"
                onClick={() => handleDownload(report.id)}
              >
                <Download size={14} /> Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
