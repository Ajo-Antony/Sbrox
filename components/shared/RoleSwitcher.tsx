"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getActiveRole, setActiveRole } from "@/lib/store";

const ROLES = [
  { id: "user", label: "User", path: "/user/browse", icon: "👤" },
  { id: "designer", label: "Designer", path: "/designer/dashboard", icon: "🎨" },
  { id: "admin", label: "Admin", path: "/admin/dashboard", icon: "🛠️" },
  { id: "super-admin", label: "Super Admin", path: "/super-admin/dashboard", icon: "👑" }
] as const;

export default function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<string>("user");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Detect current role from pathname
    if (pathname.startsWith("/designer")) {
      setCurrentRole("designer");
    } else if (pathname.startsWith("/super-admin")) {
      setCurrentRole("super-admin");
    } else if (pathname.startsWith("/admin")) {
      setCurrentRole("admin");
    } else {
      setCurrentRole("user");
    }
  }, [pathname]);

  const activeRoleObj = ROLES.find((r) => r.id === currentRole) || ROLES[0];

  const handleRoleChange = (role: typeof ROLES[number]) => {
    document.cookie = `quikdraw_demo_role=${role.id === "super-admin" ? "super_admin" : role.id}; path=/; max-age=86400`;
    setActiveRole(role.id as any);
    setCurrentRole(role.id);
    setIsOpen(false);
    router.push(role.path);
  };

  return (
    <div className="bg-ink text-white px-3 py-1.5 flex items-center justify-between text-xs font-semibold sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[#C9C4B8]">Demo View:</span>
        <span className="text-white font-bold flex items-center gap-1">
          {activeRoleObj.icon} {activeRoleObj.label}
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-[11px] px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 border border-white/15"
        >
          <span>Switch Role</span>
          <span className="text-[9px]">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white text-ink rounded-xl shadow-xl border border-line py-1 z-50 text-xs">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-inksoft font-bold border-b border-line/60">
              Select Workspace Mode
            </div>
            {ROLES.map((r) => {
              const isCurrent = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-canvas transition-colors ${
                    isCurrent ? "font-bold text-coral bg-coral/5" : "text-ink"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{r.icon}</span> {r.label}
                  </span>
                  {isCurrent && <span className="text-coral text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
