"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import TimerRing from "@/components/user/TimerRing";
import Card from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";
import { getStoredDesigners, getStoredFavorites, toggleFavorite, DesignerData } from "@/lib/store";
import { Heart, Star, MapPin, CheckCircle, ShieldCheck, Share2 } from "lucide-react";

export default function DesignerDetailClient({ id }: { id: string }) {
  const [designer, setDesigner] = useState<DesignerData | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const all = getStoredDesigners();
    const found = all.find((d) => d.id === id);
    if (found) setDesigner(found);
    const favs = getStoredFavorites();
    setIsFav(favs.includes(id));
  }, [id]);

  if (!designer) {
    return (
      <div className="p-8 text-center text-sm text-inksoft">
        <div>Loading designer profile…</div>
      </div>
    );
  }

  const handleFavorite = () => {
    const updated = toggleFavorite(id);
    setIsFav(updated);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {/* Banner */}
      <div
        className="h-[180px] relative p-4 flex justify-between items-start"
        style={{
          background: `linear-gradient(135deg, ${designer.gradient?.[0] || "#F3B8A0"}, ${
            designer.gradient?.[1] || "#E85D2C"
          })`
        }}
      >
        <Link
          href="/user/browse"
          className="w-[36px] h-[36px] rounded-full bg-white/90 shadow-md flex items-center justify-center font-bold text-ink"
        >
          ←
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-[36px] h-[36px] rounded-full bg-white/90 shadow-md flex items-center justify-center text-ink text-xs font-bold"
            title="Share profile"
          >
            {copied ? "✓" : <Share2 size={16} />}
          </button>
          <button
            onClick={handleFavorite}
            className="w-[36px] h-[36px] rounded-full bg-white/90 shadow-md flex items-center justify-center text-ink"
            title="Favorite"
          >
            <Heart size={18} className={isFav ? "fill-coral text-coral" : "text-ink"} />
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="-mt-6 bg-canvas rounded-t-xl3 relative p-5">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-display font-semibold text-2xl flex items-center gap-1.5">
              <span>{designer.name}</span>
              <span title="Verified Designer">
                <ShieldCheck size={18} className="text-emerald-600" />
              </span>
            </div>
            <div className="text-xs font-semibold text-coral mt-0.5">{designer.headline}</div>
          </div>
          <div className="bg-white border border-line rounded-xl px-2.5 py-1 text-center shadow-xs">
            <div className="font-bold text-sm text-amber-500 flex items-center gap-0.5 justify-center">
              <Star size={14} className="fill-amber-500" /> {designer.rating.toFixed(1)}
            </div>
            <div className="text-[10px] text-inksoft">128 reviews</div>
          </div>
        </div>

        <div className="text-inksoft text-[13px] mt-2.5 leading-relaxed">
          {designer.bio}
        </div>

        <div className="flex items-center gap-3 text-xs text-inksoft my-3">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-coral" /> {designer.distanceKm} km away
          </span>
          <span>·</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Free in 15 min
          </span>
        </div>

        <div className="flex gap-1.5 flex-wrap my-3.5">
          {designer.badges?.map((b) => (
            <Badge key={b}>{b}</Badge>
          ))}
        </div>

        {/* Recent Portfolio Work */}
        <div className="section-label !px-0 mt-5">Recent work & portfolio</div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-xl flex items-center justify-center p-2 text-center text-[10px] font-bold text-white shadow-xs"
              style={{
                background: `linear-gradient(135deg, ${
                  i % 2 ? designer.gradient?.[1] : designer.gradient?.[0]
                }, ${i % 2 ? designer.gradient?.[0] : designer.gradient?.[1]})`
              }}
            >
              <span>{i === 0 ? "Figma UI" : i === 1 ? "UX Flow" : "System"}</span>
            </div>
          ))}
        </div>

        {/* Client Reviews Sample */}
        <div className="section-label !px-0">What clients say</div>
        <Card className="mb-5 bg-white">
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span>Ananya R.</span>
            <span className="text-amber-500">★★★★★</span>
          </div>
          <div className="text-xs text-inksoft">
            "Meera completely redesigned my onboarding screen hierarchy in 15 minutes. Best decision ever!"
          </div>
        </Card>

        <div className="h-px bg-line my-4" />

        {/* Instant Booking CTA */}
        <Link
          href={`/user/booking/${designer.id}`}
          className="flex items-center gap-3.5 bg-ink text-white rounded-xl2 px-4 py-3.5 shadow-xl hover:bg-black transition-colors"
        >
          <TimerRing />
          <div className="flex-1">
            <div className="font-semibold text-[15px]">Book instant 15-min slot</div>
            <div className="text-xs text-[#C9C4B8] mt-0.5">
              {formatINR(designer.ratePer15)} / 15min · pay after session
            </div>
          </div>
          <div className="text-xl font-bold">→</div>
        </Link>
      </div>
    </div>
  );
}
