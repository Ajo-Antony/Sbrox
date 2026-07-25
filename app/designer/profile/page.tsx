"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { getStoredDesigners, saveDesigners, DesignerData } from "@/lib/store";
import { User, DollarSign, Tag, Check, Edit2 } from "lucide-react";

export default function DesignerProfilePage() {
  const [designer, setDesigner] = useState<DesignerData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [rate, setRate] = useState(499);
  const [category, setCategory] = useState("UI Design");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const designers = getStoredDesigners();
    const meera = designers.find((d) => d.id === "meera-nair") || designers[0];
    if (meera) {
      setDesigner(meera);
      setName(meera.name);
      setHeadline(meera.headline);
      setBio(meera.bio);
      setRate(meera.ratePer15);
      setCategory(meera.category);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designer) return;
    const all = getStoredDesigners();
    const updated = all.map((d) =>
      d.id === designer.id
        ? {
            ...d,
            name,
            headline,
            bio,
            ratePer15: rate,
            category
          }
        : d
    );
    saveDesigners(updated);
    setDesigner({
      ...designer,
      name,
      headline,
      bio,
      ratePer15: rate,
      category
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (!designer) return null;

  return (
    <div>
      <TopBar title="Your profile" sub="What users see on your public booking page" />

      {savedSuccess && (
        <div className="mx-5 mb-4 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2.5 border border-sage/20 flex items-center gap-1.5">
          <Check size={14} /> Profile updated successfully!
        </div>
      )}

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {!isEditing ? (
          <>
            <Card>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-[16px]">{designer.name}</div>
                  <div className="text-xs text-coral font-medium mt-0.5">{designer.headline}</div>
                </div>
                <div className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  ★ {designer.rating.toFixed(1)}
                </div>
              </div>

              <div className="text-xs text-inksoft mt-2 leading-relaxed">{designer.bio}</div>

              <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-line/60">
                <Badge>{designer.category}</Badge>
                {designer.badges?.map((b) => (
                  <Badge key={b}>{b}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <div className="text-xs font-semibold text-inksoft mb-1">Slot Rate</div>
              <div className="font-display font-bold text-coraldark text-lg">
                {formatINR(designer.ratePer15)} <span className="text-xs font-sans text-inksoft font-normal">/ 15-minute call</span>
              </div>
            </Card>

            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => setIsEditing(true)}>
              <Edit2 size={15} /> Edit profile details
            </Button>
          </>
        ) : (
          <Card>
            <form onSubmit={handleSave} className="flex flex-col gap-3 text-xs">
              <div className="font-bold text-sm text-ink mb-1">Edit Designer Profile</div>

              <div>
                <label className="text-inksoft font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-line rounded-xl px-3 py-2 bg-white text-xs"
                />
              </div>

              <div>
                <label className="text-inksoft font-semibold block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full border border-line rounded-xl px-3 py-2 bg-white text-xs"
                />
              </div>

              <div>
                <label className="text-inksoft font-semibold block mb-1">Primary Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-line rounded-xl px-3 py-2 bg-white text-xs"
                >
                  <option value="UI Design">UI Design</option>
                  <option value="Website Redesign">Website Redesign</option>
                  <option value="Photoshop">Photoshop</option>
                </select>
              </div>

              <div>
                <label className="text-inksoft font-semibold block mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-line rounded-xl p-2 bg-white text-xs h-20 resize-none"
                />
              </div>

              <div>
                <label className="text-inksoft font-semibold block mb-1">Rate per 15-min slot (INR)</label>
                <input
                  type="number"
                  min={99}
                  max={2999}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full border border-line rounded-xl px-3 py-2 bg-white text-xs font-bold text-coral"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
