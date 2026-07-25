"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  user: [
    { href: "/user/browse", label: "Browse", icon: "⌂" },
    { href: "/user/bookings", label: "Bookings", icon: "◷" },
    { href: "/user/profile", label: "Profile", icon: "◍" }
  ],
  designer: [
    { href: "/designer/dashboard", label: "Dashboard", icon: "⌂" },
    { href: "/designer/bookings", label: "Bookings", icon: "◷" },
    { href: "/designer/portfolio", label: "Portfolio", icon: "✎" },
    { href: "/designer/earnings", label: "Earnings", icon: "₹" },
    { href: "/designer/profile", label: "Profile", icon: "◍" }
  ],
  admin: [
    { href: "/admin/dashboard", label: "Overview", icon: "⌂" },
    { href: "/admin/designers", label: "Designers", icon: "✎" },
    { href: "/admin/bookings", label: "Bookings", icon: "◷" },
    { href: "/admin/categories", label: "Categories", icon: "▤" },
    { href: "/admin/disputes", label: "Disputes", icon: "!" }
  ],
  "super-admin": [
    { href: "/super-admin/dashboard", label: "Overview", icon: "⌂" },
    { href: "/super-admin/admins", label: "Admins", icon: "◍" },
    { href: "/super-admin/analytics", label: "Analytics", icon: "▲" },
    { href: "/super-admin/commission", label: "Commission", icon: "₹" },
    { href: "/super-admin/platform-settings", label: "Settings", icon: "⚙" }
  ]
};

export default function BottomNav({ role }: { role: keyof typeof NAV_BY_ROLE }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-line flex justify-around py-3 pb-4 max-w-[430px] mx-auto">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-center text-[11px] font-semibold ${
              active ? "text-coraldark" : "text-inksoft"
            }`}
          >
            <span className="block text-lg mb-0.5">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
