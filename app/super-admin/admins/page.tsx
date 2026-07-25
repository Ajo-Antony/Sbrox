import TopBar from "@/components/shared/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const MOCK = [
  { id: "adm_1", name: "Sneha Varma", market: "Kochi", role: "Market admin" },
  { id: "adm_2", name: "Vishal Kurup", market: "Bengaluru", role: "Market admin" }
];

export default function SuperAdminAdminsPage() {
  return (
    <div>
      <TopBar title="Admins" sub="Manage who can moderate each market" />
      <div className="px-5 flex flex-col gap-3 mb-5">
        {MOCK.map((a) => (
          <Card key={a.id} className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-[15px]">{a.name}</div>
              <div className="text-xs text-inksoft mt-0.5">{a.market}</div>
            </div>
            <Badge>{a.role}</Badge>
          </Card>
        ))}
      </div>
      <div className="px-5">
        <Button variant="dark" className="w-full">
          Invite admin
        </Button>
      </div>
    </div>
  );
}
