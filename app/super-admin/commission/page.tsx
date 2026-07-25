"use client";

import { useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CommissionSlider from "@/components/super-admin/CommissionSlider";
import { saveCommission } from "@/lib/store";
import { Check } from "lucide-react";

export default function CommissionPage() {
  const [val, setVal] = useState(15);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveCommission(val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <TopBar title="Commission Rate" sub="Applies automatically to every new booking platform-wide" />

      {saved && (
        <div className="mx-5 mb-3 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2 border border-sage/20 flex items-center gap-1.5">
          <Check size={14} /> Platform take rate set to {val}%! Saved.
        </div>
      )}

      <div className="px-5 flex flex-col gap-4">
        <Card>
          <CommissionSlider onChange={setVal} />
        </Card>

        <Card className="bg-canvas border-line text-xs text-inksoft leading-relaxed">
          <span className="font-semibold text-ink block mb-0.5">Platform Revenue Model</span>
          For a ₹499 design slot with a {val}% commission, the platform earns{" "}
          <strong className="text-coraldark">₹{Math.round((499 * val) / 100)}</strong> and the designer receives{" "}
          <strong className="text-sage">₹{Math.round(499 - (499 * val) / 100)}</strong>.
        </Card>

        <Button variant="dark" className="w-full shadow-md" onClick={handleSave}>
          Save Commission Rate
        </Button>
      </div>
    </div>
  );
}
