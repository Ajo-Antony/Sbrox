"use client";

import { useState } from "react";
import TopBar from "@/components/shared/TopBar";
import AvailabilityToggle from "@/components/designer/AvailabilityToggle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Clock, Calendar, Check } from "lucide-react";

export default function AvailabilityPage() {
  const [workingDays, setWorkingDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("20:00");
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <TopBar title="Availability" sub="Control when instant 15-min bookings reach you" />

      {saved && (
        <div className="mx-5 mb-3 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2 border border-sage/20 flex items-center gap-1.5">
          <Check size={14} /> Schedule settings saved!
        </div>
      )}

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <AvailabilityToggle />

        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold mb-2 text-ink">
            <Calendar size={16} className="text-coral" /> Working Days
          </div>
          <div className="flex gap-1.5 justify-between my-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
              const active = workingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    active
                      ? "bg-coral text-white"
                      : "bg-white text-inksoft border border-line"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold mb-3 text-ink">
            <Clock size={16} className="text-coral" /> Daily Working Hours
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-inksoft font-semibold block mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-line rounded-xl px-3 py-2 bg-white text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-inksoft font-semibold block mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-line rounded-xl px-3 py-2 bg-white text-xs font-semibold"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold mb-1">Slot Duration</div>
          <div className="text-xs text-inksoft">
            Fixed at 15 minutes per session for quick turnaround design calls.
          </div>
        </Card>

        <Button variant="dark" className="w-full mt-2" onClick={handleSave}>
          Save availability schedule
        </Button>
      </div>
    </div>
  );
}
