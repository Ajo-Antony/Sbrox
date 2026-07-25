import { MOCK_DESIGNERS } from "./mock-data";
import { CATEGORIES } from "./constants";
import type { Category } from "./types";

export interface PortfolioItem {
  id: string;
  designerId: string;
  imageUrl: string;
  caption?: string;
  gradient?: [string, string];
}

export interface DesignerData {
  id: string;
  name: string;
  headline: string;
  category: string;
  ratePer15: number;
  distanceKm: number;
  rating: number;
  isAvailableNow: boolean;
  gradient: [string, string];
  bio: string;
  badges: string[];
  status: "pending_review" | "approved" | "suspended";
  submittedAgo?: string;
  portfolio?: PortfolioItem[];
}

export interface BookingData {
  id: string;
  designerId: string;
  designerName: string;
  userName: string;
  category: string;
  slot: string;
  rate: number;
  tip: number;
  total: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed";
  paymentMethod: string;
  createdAt: string;
  notes?: string;
  callStartedAt?: string;
  rating?: number;
  review?: string;
}

export interface DisputeData {
  id: string;
  bookingId: string;
  user: string;
  designer: string;
  reason: string;
  status: "Open" | "Refunded" | "Released";
  createdAt: string;
}

export interface MarketAdminData {
  id: string;
  name: string;
  market: string;
  role: string;
  email: string;
}

const INITIAL_BOOKINGS: BookingData[] = [
  {
    id: "bk_2001",
    designerId: "meera-nair",
    designerName: "Meera Nair",
    userName: "Ananya R.",
    category: "UI Design",
    slot: "Now (2:15 PM)",
    rate: 499,
    tip: 49,
    total: 548,
    status: "in_progress",
    paymentMethod: "upi",
    createdAt: new Date().toISOString(),
    notes: "Need quick feedback on onboarding screens for fintech app"
  },
  {
    id: "bk_2000",
    designerId: "meera-nair",
    designerName: "Meera Nair",
    userName: "Kiran S.",
    category: "UI Design",
    slot: "Today, 3:00 PM",
    rate: 499,
    tip: 0,
    total: 499,
    status: "confirmed",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    notes: "Review SaaS analytics dashboard component hierarchy"
  },
  {
    id: "bk_1990",
    designerId: "divya-krishnan",
    designerName: "Divya Krishnan",
    userName: "Farhan M.",
    category: "Photoshop",
    slot: "Yesterday, 5:30 PM",
    rate: 299,
    tip: 0,
    total: 299,
    status: "completed",
    paymentMethod: "upi",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    rating: 5,
    review: "Amazing background removal and photo touchups in just 15 mins!"
  }
];

const INITIAL_DISPUTES: DisputeData[] = [
  {
    id: "disp_11",
    bookingId: "bk_1978",
    user: "Rohan K.",
    designer: "Rahul Menon",
    reason: "Designer didn't join the video call room within 5 mins",
    status: "Open",
    createdAt: "2026-07-24"
  }
];

const INITIAL_ADMINS: MarketAdminData[] = [
  { id: "adm_1", name: "Sneha Varma", market: "Kochi", role: "Market admin", email: "sneha@quikdraw.com" },
  { id: "adm_2", name: "Vishal Kurup", market: "Bengaluru", role: "Market admin", email: "vishal@quikdraw.com" }
];

// LocalStorage keys
const STORAGE_KEYS = {
  DESIGNERS: "quikdraw_designers",
  BOOKINGS: "quikdraw_bookings",
  CATEGORIES: "quikdraw_categories",
  DISPUTES: "quikdraw_disputes",
  ADMINS: "quikdraw_admins",
  ROLE: "quikdraw_current_role",
  COMMISSION: "quikdraw_commission",
  FAVORITES: "quikdraw_favorites"
};

export function getStoredDesigners(): DesignerData[] {
  if (typeof window === "undefined") {
    return MOCK_DESIGNERS.map((d) => ({
      ...d,
      status: "approved" as const
    }));
  }
  const raw = localStorage.getItem(STORAGE_KEYS.DESIGNERS);
  if (!raw) {
    const initial: DesignerData[] = MOCK_DESIGNERS.map((d) => ({
      ...d,
      status: "approved" as const
    }));
    // Add a pending application designer demo
    initial.push({
      id: "nikhil-pillai",
      name: "Nikhil Pillai",
      headline: "UI Design · Mobile Apps",
      category: "UI Design",
      ratePer15: 449,
      distanceKm: 2.5,
      rating: 4.9,
      isAvailableNow: false,
      gradient: ["#B9A6E0", "#6C4FB0"],
      bio: "Figma specialist creating iOS and Android app interfaces.",
      badges: ["Figma", "iOS", "UI Design"],
      status: "pending_review",
      submittedAgo: "2h ago"
    });
    localStorage.setItem(STORAGE_KEYS.DESIGNERS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return MOCK_DESIGNERS.map((d) => ({ ...d, status: "approved" }));
  }
}

export function saveDesigners(data: DesignerData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.DESIGNERS, JSON.stringify(data));
  window.dispatchEvent(new Event("quikdraw_data_changed"));
}

export function getStoredBookings(): BookingData[] {
  if (typeof window === "undefined") return INITIAL_BOOKINGS;
  const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBookings(data: BookingData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(data));
  window.dispatchEvent(new Event("quikdraw_data_changed"));
}

export function addBooking(newBooking: Omit<BookingData, "id" | "createdAt">): BookingData {
  const current = getStoredBookings();
  const created: BookingData = {
    ...newBooking,
    id: `bk_${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString()
  };
  saveBookings([created, ...current]);
  return created;
}

export function updateBookingStatus(id: string, status: BookingData["status"], extra?: Partial<BookingData>) {
  const current = getStoredBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status, ...extra } : b));
  saveBookings(updated);
}

export function getStoredCategories(): string[] {
  if (typeof window === "undefined") return [...CATEGORIES];
  const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([...CATEGORIES]));
    return [...CATEGORIES];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [...CATEGORIES];
  }
}

export function saveCategories(categories: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  window.dispatchEvent(new Event("quikdraw_data_changed"));
}

export function getStoredDisputes(): DisputeData[] {
  if (typeof window === "undefined") return INITIAL_DISPUTES;
  const raw = localStorage.getItem(STORAGE_KEYS.DISPUTES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(INITIAL_DISPUTES));
    return INITIAL_DISPUTES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DISPUTES;
  }
}

export function saveDisputes(disputes: DisputeData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(disputes));
  window.dispatchEvent(new Event("quikdraw_data_changed"));
}

export function getStoredAdmins(): MarketAdminData[] {
  if (typeof window === "undefined") return INITIAL_ADMINS;
  const raw = localStorage.getItem(STORAGE_KEYS.ADMINS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
    return INITIAL_ADMINS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADMINS;
  }
}

export function saveAdmins(admins: MarketAdminData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
  window.dispatchEvent(new Event("quikdraw_data_changed"));
}

export function getStoredCommission(): number {
  if (typeof window === "undefined") return 15;
  const raw = localStorage.getItem(STORAGE_KEYS.COMMISSION);
  return raw ? Number(raw) : 15;
}

export function saveCommission(val: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.COMMISSION, val.toString());
  window.dispatchEvent(new Event("quikdraw_data_changed"));
}

export function getStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return raw ? JSON.parse(raw) : [];
}

export function toggleFavorite(id: string): boolean {
  if (typeof window === "undefined") return false;
  const favs = getStoredFavorites();
  let updated: string[];
  let isFav = false;
  if (favs.includes(id)) {
    updated = favs.filter((f) => f !== id);
  } else {
    updated = [...favs, id];
    isFav = true;
  }
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  window.dispatchEvent(new Event("quikdraw_data_changed"));
  return isFav;
}

export function getActiveRole(): "user" | "designer" | "admin" | "super-admin" {
  if (typeof window === "undefined") return "user";
  const raw = localStorage.getItem(STORAGE_KEYS.ROLE);
  return (raw as any) || "user";
}

export function setActiveRole(role: "user" | "designer" | "admin" | "super-admin") {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ROLE, role);
  window.dispatchEvent(new Event("quikdraw_role_changed"));
}
