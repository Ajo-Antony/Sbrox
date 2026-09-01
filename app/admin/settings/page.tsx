"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckCircle2, Edit2, Plus, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

interface Setting {
  id: string;
  name: string;
  value: string | number;
  type: "text" | "number" | "toggle";
}

const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "UI Design", icon: "🎨", enabled: true },
  { id: "c2", name: "Photoshop", icon: "📸", enabled: true },
  { id: "c3", name: "Web Development", icon: "💻", enabled: true },
  { id: "c4", name: "Logo Design", icon: "✏️", enabled: false },
];

const MOCK_SETTINGS: Setting[] = [
  { id: "s1", name: "Platform Commission Rate", value: 15, type: "number" },
  { id: "s2", name: "Minimum Booking Amount", value: 500, type: "number" },
  { id: "s3", name: "Maximum Booking Amount", value: 50000, type: "number" },
  { id: "s4", name: "Auto-cancel unconfirmed bookings (hours)", value: 24, type: "number" },
];

export default function AdminSettingsPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [settings, setSettings] = useState<Setting[]>(MOCK_SETTINGS);
  const [action, setAction] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingSettings, setEditingSettings] = useState<Record<string, string | number | undefined>>({});

  const handleToggleCategory = (id: string) => {
    setCategories(categories.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
    setAction("Category status updated");
    setTimeout(() => setAction(null), 2500);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    setAction("Category deleted");
    setTimeout(() => setAction(null), 2500);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `c${Date.now()}`,
        name: newCategoryName,
        icon: "📂",
        enabled: true,
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setAction("Category added successfully");
      setTimeout(() => setAction(null), 2500);
    }
  };

  const handleSettingChange = (id: string, value: string | number) => {
    setEditingSettings({ ...editingSettings, [id]: value });
  };

  const handleSaveSetting = (id: string) => {
    const newValue = editingSettings[id];
    if (newValue !== undefined) {
      setSettings(settings.map((s) => (s.id === id ? { ...s, value: newValue } : s)));
      setEditingSettings({ ...editingSettings, [id]: undefined });
      setAction("Setting updated");
      setTimeout(() => setAction(null), 2500);
    }
  };

  return (
    <div>
      <TopBar title="Settings" sub="Manage platform categories, commissions & system settings" />

      {action && (
        <div className="mx-5 mb-3 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2.5 border border-sage/20 flex items-center gap-1.5">
          <CheckCircle2 size={14} /> {action}
        </div>
      )}

      {/* System Settings */}
      <div className="section-label px-5 mt-5">System Settings</div>

      <div className="px-5 space-y-2 mb-6">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-sm">{setting.name}</div>
                {editingSettings[setting.id] === undefined ? (
                  <div className="text-xs text-inksoft mt-0.5">
                    Current value: <span className="font-semibold text-ink">{setting.value}</span>
                  </div>
                ) : (
                  <input
                    type={setting.type === "number" ? "number" : "text"}
                    value={editingSettings[setting.id]}
                    onChange={(e) =>
                      handleSettingChange(setting.id, setting.type === "number" ? parseInt(e.target.value) : e.target.value)
                    }
                    className="mt-1 px-2 py-1 text-xs rounded border border-line focus:outline-none focus:border-ink"
                  />
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {editingSettings[setting.id] === undefined ? (
                  <Button
                    variant="outline"
                    className="!px-2 !py-1 text-xs"
                    onClick={() => handleSettingChange(setting.id, setting.value)}
                  >
                    <Edit2 size={14} />
                  </Button>
                ) : (
                  <>
                    <Button
                      className="!px-2 !py-1 text-xs"
                      onClick={() => handleSaveSetting(setting.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="!px-2 !py-1 text-xs"
                      onClick={() => setEditingSettings({ ...editingSettings, [setting.id]: undefined })}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Categories Management */}
      <div className="section-label px-5">Browse Categories</div>

      <div className="px-5 mb-4">
        <Card>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add new category..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              className="flex-1 px-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-ink"
            />
            <Button
              className="!px-4 text-xs flex items-center gap-1.5"
              onClick={handleAddCategory}
            >
              <Plus size={14} /> Add
            </Button>
          </div>
        </Card>
      </div>

      <div className="px-5 space-y-2">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xl">{cat.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{cat.name}</div>
                  <div className="text-xs text-inksoft">
                    Status: {cat.enabled ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={`!px-3 !py-1 text-xs ${
                    cat.enabled
                      ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                      : "border-sage text-sage hover:bg-sagebg"
                  }`}
                  onClick={() => handleToggleCategory(cat.id)}
                >
                  {cat.enabled ? "Disable" : "Enable"}
                </Button>
                <Button
                  className="!px-3 !py-1 text-xs border-red-200 text-red-600 hover:bg-red-50"
                  variant="outline"
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
