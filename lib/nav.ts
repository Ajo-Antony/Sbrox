export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_BY_ROLE: Record<string, NavItem[]> = {
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

export const ROLE_LABEL: Record<keyof typeof NAV_BY_ROLE, string> = {
  user: "Quikdraw",
  designer: "Designer Studio",
  admin: "Admin Console",
  "super-admin": "Super Admin"
};
