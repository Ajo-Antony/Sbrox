"use client";

import { useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface WorkItem {
  id: string;
  title: string;
  c1: string;
  c2: string;
}

const INITIAL_WORK: WorkItem[] = [
  { id: "1", title: "Fintech Dashboard", c1: "#F3B8A0", c2: "#E85D2C" },
  { id: "2", title: "iOS Onboarding Flow", c1: "#9AC1B6", c2: "#3F6B58" },
  { id: "3", title: "Design System UI", c1: "#E8C97A", c2: "#C9A15C" },
  { id: "4", title: "Shopify Store Redesign", c1: "#8FBEDB", c2: "#2E6E93" }
];

export default function PortfolioPage() {
  const [works, setWorks] = useState<WorkItem[]>(INITIAL_WORK);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [gradientPair, setGradientPair] = useState<[string, string]>(["#B9A6E0", "#6C4FB0"]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: WorkItem = {
      id: Date.now().toString(),
      title: newTitle,
      c1: gradientPair[0],
      c2: gradientPair[1]
    };
    setWorks([item, ...works]);
    setNewTitle("");
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setWorks(works.filter((w) => w.id !== id));
  };

  return (
    <div>
      <TopBar title="Portfolio" sub="Showcase your best design shots on your profile" />

      <div className="px-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mb-5">
        {works.map((w) => (
          <div key={w.id} className="group relative">
            <div
              className="aspect-square rounded-xl2 p-3 flex flex-col justify-end text-white shadow-sm font-semibold text-xs overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${w.c1}, ${w.c2})` }}
            >
              <div className="bg-black/30 backdrop-blur-xs p-2 rounded-lg">
                {w.title}
              </div>
            </div>
            <button
              onClick={() => handleDelete(w.id)}
              className="absolute top-2 right-2 w-7 h-7 bg-red-600/90 text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 shadow-md transition-opacity"
              title="Delete work"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="px-5">
        <Button
          variant="dark"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} /> Upload new work
        </Button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-canvas text-ink w-full max-w-sm rounded-2xl p-5 border border-line shadow-2xl">
            <div className="font-display font-semibold text-lg mb-1">Add Portfolio Work</div>
            <div className="text-xs text-inksoft mb-4">
              Add a new design shot to your public booking page.
            </div>

            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-inksoft block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-commerce Mobile App"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-line rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-coral"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-inksoft block mb-1">Gradient Preset</label>
                <div className="flex gap-2">
                  {[
                    ["#F3B8A0", "#E85D2C"],
                    ["#9AC1B6", "#3F6B58"],
                    ["#E8C97A", "#C9A15C"],
                    ["#B9A6E0", "#6C4FB0"],
                    ["#8FBEDB", "#2E6E93"]
                  ].map((pair, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGradientPair(pair as [string, string])}
                      style={{ background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})` }}
                      className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                        gradientPair[0] === pair[0] ? "scale-110 border-ink shadow-md" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1 text-xs">
                  Save Shot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
