"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_BY_ROLE } from "@/lib/nav";

export default function BottomNav({ role }: { role: keyof typeof NAV_BY_ROLE }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-line flex justify-around py-3 pb-4 z-40">
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
