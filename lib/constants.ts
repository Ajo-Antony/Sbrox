import type { Category } from "./types";

export const CATEGORIES: Category[] = ["UI Design", "Website Redesign", "Photoshop"];

export const TIP_OPTIONS = [0, 49, 99, 149];

export const SLOT_OFFSETS_MIN = [0, 15, 30];

export const PAYMENT_METHODS = [
  { id: "upi", icon: "📱", label: "UPI" },
  { id: "card", icon: "💳", label: "Credit / debit card" },
  { id: "wallet", icon: "👛", label: "Wallet" },
  { id: "netbanking", icon: "🏦", label: "Net banking" }
] as const;

export const PLATFORM_COMMISSION_PERCENT = 15;
