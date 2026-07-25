import BottomNav from "@/components/shared/BottomNav";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell pb-24">
      {children}
      <BottomNav role="user" />
    </div>
  );
}
