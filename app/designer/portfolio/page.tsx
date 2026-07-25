import TopBar from "@/components/shared/TopBar";
import Button from "@/components/ui/Button";

const MOCK_WORK = [
  { id: 1, c1: "#F3B8A0", c2: "#E85D2C" },
  { id: 2, c1: "#E85D2C", c2: "#F3B8A0" },
  { id: 3, c1: "#F3B8A0", c2: "#E85D2C" },
  { id: 4, c1: "#E85D2C", c2: "#F3B8A0" }
];

export default function PortfolioPage() {
  return (
    <div>
      <TopBar title="Portfolio" sub="Shown on your public profile" />
      <div className="px-5 grid grid-cols-2 gap-3 mb-5">
        {MOCK_WORK.map((w) => (
          <div
            key={w.id}
            className="aspect-square rounded-xl2"
            style={{ background: `linear-gradient(135deg, ${w.c1}, ${w.c2})` }}
          />
        ))}
      </div>
      <div className="px-5">
        <Button variant="dark" className="w-full">
          Upload new work
        </Button>
      </div>
    </div>
  );
}
