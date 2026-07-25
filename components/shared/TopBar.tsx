export default function TopBar({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="px-5 pt-6 pb-3">
      <div className="font-display font-semibold text-xl tracking-tight">{title}</div>
      {sub && <div className="text-sm text-inksoft mt-1">{sub}</div>}
    </div>
  );
}
