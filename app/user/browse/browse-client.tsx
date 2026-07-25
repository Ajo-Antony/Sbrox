"use client";

import { useEffect, useState } from "react";
import DesignerCard from "@/components/user/DesignerCard";
import CategoryChips from "@/components/user/CategoryChips";
import { getStoredDesigners, getStoredCategories, DesignerData } from "@/lib/store";
import { Search, MapPin, SlidersHorizontal, Sparkles, Heart } from "lucide-react";

export default function BrowseClient({ initialCategory = "All" }: { initialCategory?: string }) {
  const [designers, setDesigners] = useState<DesignerData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "rate">("distance");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const refreshData = () => {
    const allDesigners = getStoredDesigners();
    // Only show approved designers to users
    const approved = allDesigners.filter((d) => d.status === "approved" || !d.status);
    setDesigners(approved);
    setCategories(getStoredCategories());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener("quikdraw_data_changed", refreshData);
    return () => window.removeEventListener("quikdraw_data_changed", refreshData);
  }, []);

  // Filter logic
  let filtered = designers.filter((d) => {
    // Category match
    if (activeCategory !== "All" && d.category !== activeCategory) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchHead = d.headline.toLowerCase().includes(q);
      const matchBio = d.bio?.toLowerCase().includes(q);
      const matchBadges = d.badges?.some((b) => b.toLowerCase().includes(q));
      if (!matchName && !matchHead && !matchBio && !matchBadges) return false;
    }
    // Availability filter
    if (onlyAvailable && !d.isAvailableNow) return false;
    return true;
  });

  // Sort logic
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "rate") return a.ratePer15 - b.ratePer15;
    return a.distanceKm - b.distanceKm; // Default distance
  });

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="font-display font-semibold text-[24px] tracking-tight text-ink">
            Quik<span className="text-coral">draw</span>
          </div>
          <div className="bg-coral/10 text-coraldark text-[11px] font-bold px-2.5 py-1 rounded-full border border-coral/20 flex items-center gap-1">
            <Sparkles size={12} /> 15-Min Instant Calls
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-inksoft text-[12px] mt-1">
          <MapPin size={13} className="text-coral" />
          <span className="font-semibold text-ink">Kochi, Kerala</span> · within 5 km
        </div>
      </div>

      {/* Interactive Search Bar */}
      <div className="mx-5 mb-3 relative">
        <Search className="absolute left-3.5 top-3 text-inksoft" size={16} />
        <input
          type="text"
          placeholder="Search UI, website redesign, Photoshop..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-line rounded-xl pl-9 pr-8 py-2.5 text-sm text-ink placeholder-inksoft focus:outline-none focus:border-coral transition-colors shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-2.5 text-xs text-inksoft font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Chips */}
      <CategoryChips
        active={activeCategory}
        onChange={(cat) => setActiveCategory(cat)}
      />

      {/* Quick Filter & Sort Options */}
      <div className="px-5 mb-3 flex items-center justify-between text-xs text-inksoft">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={12} />
          <span className="font-semibold text-ink">{filtered.length} Designers</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              onlyAvailable ? "bg-sagebg text-sage border-sage/30 font-bold" : "bg-white border-line text-inksoft"
            }`}
          >
            ● Free Now
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-line rounded-lg px-2 py-1 text-xs font-semibold text-ink focus:outline-none"
          >
            <option value="distance">Nearest</option>
            <option value="rating">Top Rated</option>
            <option value="rate">Lowest Rate</option>
          </select>
        </div>
      </div>

      {/* Section Header */}
      <div className="section-label">Available for 15-Min Slots</div>

      {/* Designer Cards Stream */}
      <div className="px-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pb-8">
        {filtered.map((d) => (
          <DesignerCard key={d.id} d={d} />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 px-4 bg-white rounded-2xl border border-line my-2">
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-semibold text-sm text-ink mb-1">No designers match filters</div>
            <div className="text-xs text-inksoft max-w-xs mx-auto">
              Try clearing your search term or switching to another category chip above.
            </div>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
                setOnlyAvailable(false);
              }}
              className="mt-3 text-xs font-bold text-coral underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
