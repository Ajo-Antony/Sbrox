"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getStoredCategories, saveCategories } from "@/lib/store";
import { Plus, Trash2, Check } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = () => {
    setCategories(getStoredCategories());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("quikdraw_data_changed", refresh);
    return () => window.removeEventListener("quikdraw_data_changed", refresh);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim() || categories.includes(newCat.trim())) return;
    const updated = [...categories, newCat.trim()];
    saveCategories(updated);
    setCategories(updated);
    setNewCat("");
    setShowAddModal(false);
    setNotice("New category added!");
    setTimeout(() => setNotice(""), 2000);
  };

  const handleDelete = (catName: string) => {
    const updated = categories.filter((c) => c !== catName);
    saveCategories(updated);
    setCategories(updated);
    setNotice(`Removed ${catName}`);
    setTimeout(() => setNotice(""), 2000);
  };

  return (
    <div>
      <TopBar title="Categories" sub="Shown as filter chips on the user Browse screen" />

      {notice && (
        <div className="mx-5 mb-3 bg-sagebg text-sage text-xs font-semibold rounded-xl px-4 py-2 border border-sage/20 flex items-center gap-1.5">
          <Check size={14} /> {notice}
        </div>
      )}

      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {categories.map((c) => (
          <Card key={c} className="flex justify-between items-center">
            <div className="font-semibold text-sm">{c}</div>
            <button
              onClick={() => handleDelete(c)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Category"
            >
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
      </div>

      <div className="px-5">
        <Button
          variant="dark"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} /> Add new category
        </Button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-canvas text-ink w-full max-w-sm rounded-2xl p-5 border border-line shadow-2xl">
            <div className="font-display font-semibold text-lg mb-1">Add New Category</div>
            <div className="text-xs text-inksoft mb-4">
              Create a new design service category chip.
            </div>

            <form onSubmit={handleAdd} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-inksoft block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Logo Design, Figma Audit..."
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full border border-line rounded-xl px-3.5 py-2.5 bg-white text-xs focus:outline-none focus:border-coral"
                />
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Create Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
