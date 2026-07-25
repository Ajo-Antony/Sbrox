import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import { NAV_BY_ROLE } from "@/lib/nav";

export default function AppShell({
  role,
  children
}: {
  role: keyof typeof NAV_BY_ROLE;
  children: React.ReactNode;
}) {
  return (
    <div className="md:flex md:min-h-screen">
      <Sidebar role={role} />
      <div className="flex-1 min-w-0 pb-24 md:pb-10">
        <div className="md:max-w-4xl md:mx-auto md:py-6">{children}</div>
      </div>
      <BottomNav role={role} />
    </div>
  );
}
