import Link from "next/link";
import { LayoutDashboard, Users, TrendingUp, Settings, Logs, Activity } from "lucide-react";

export default function SuperAdminNav() {
  return (
    <nav className="space-y-1">
      <NavLink href="/super-admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
      <NavLink href="/super-admin/admins" icon={<Users size={18} />} label="Admin Management" />
      <NavLink href="/super-admin/analytics" icon={<TrendingUp size={18} />} label="Analytics" />
      <NavLink href="/super-admin/commission" icon={<Settings size={18} />} label="Commission Rates" />
      <NavLink href="/super-admin/platform-settings" icon={<Settings size={18} />} label="Platform Settings" />
      <NavLink href="/super-admin/logs" icon={<Logs size={18} />} label="Audit Logs" />
      <NavLink href="/super-admin/health" icon={<Activity size={18} />} label="System Health" />
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-canvas transition-colors text-sm font-medium text-inksoft hover:text-ink">
        {icon}
        {label}
      </div>
    </Link>
  );
}
