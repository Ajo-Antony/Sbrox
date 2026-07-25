import type { DesignerCardData } from "@/components/user/DesignerCard";

export const MOCK_DESIGNERS: (DesignerCardData & {
  category: string;
  bio: string;
  badges: string[];
})[] = [
  {
    id: "meera-nair",
    name: "Meera Nair",
    headline: "UI design · Mobile apps",
    category: "UI Design",
    ratePer15: 499,
    distanceKm: 0.8,
    rating: 4.9,
    isAvailableNow: true,
    gradient: ["#F3B8A0", "#E85D2C"],
    bio: "Product designer specialising in fintech and SaaS dashboards.",
    badges: ["UI design", "Design systems", "Figma"]
  },
  {
    id: "arjun-vishnu",
    name: "Arjun Vishnu",
    headline: "Website redesign · Landing pages",
    category: "Website Redesign",
    ratePer15: 399,
    distanceKm: 1.4,
    rating: 4.8,
    isAvailableNow: true,
    gradient: ["#9AC1B6", "#3F6B58"],
    bio: "Redesigns tired websites into fast, modern storefronts.",
    badges: ["Webflow", "Landing pages", "SEO layout"]
  },
  {
    id: "divya-krishnan",
    name: "Divya Krishnan",
    headline: "Photoshop · Photo retouch",
    category: "Photoshop",
    ratePer15: 299,
    distanceKm: 2.1,
    rating: 5.0,
    isAvailableNow: true,
    gradient: ["#E8C97A", "#C9A15C"],
    bio: "Product photo retouching and ad creatives for e-commerce.",
    badges: ["Retouching", "Ad creatives", "Photoshop"]
  },
  {
    id: "rahul-menon",
    name: "Rahul Menon",
    headline: "UI design · Branding",
    category: "UI Design",
    ratePer15: 599,
    distanceKm: 3.0,
    rating: 4.7,
    isAvailableNow: true,
    gradient: ["#B9A6E0", "#6C4FB0"],
    bio: "Brand + interface designer for early-stage startups.",
    badges: ["Branding", "UI design", "Logo"]
  },
  {
    id: "sana-fathima",
    name: "Sana Fathima",
    headline: "Website redesign · Shopify",
    category: "Website Redesign",
    ratePer15: 449,
    distanceKm: 3.6,
    rating: 4.9,
    isAvailableNow: true,
    gradient: ["#8FBEDB", "#2E6E93"],
    bio: "Shopify and WordPress store redesigns that convert.",
    badges: ["Shopify", "WordPress", "CRO"]
  }
];
