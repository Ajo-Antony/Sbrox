"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_BY_ROLE, ROLE_LABEL } from "@/lib/nav";

export default function Sidebar({ role }: { role: keyof typeof NAV_BY_ROLE }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-line bg-white">
      <div className="px-5 pt-6 pb-4">
        <div className="font-display font-semibold text-lg tracking-tight">
          {ROLE_LABEL[role]}
        </div>
      </div>
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                active ? "bg-ink text-white" : "text-inksoft hover:bg-canvas"
              }`}
            >
              <span className="text-base w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
