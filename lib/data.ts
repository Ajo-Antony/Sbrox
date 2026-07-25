import { MOCK_DESIGNERS } from "./mock-data";
import { getStoredDesigners } from "./store";

export async function listDesigners(category?: string) {
  const designers = typeof window !== "undefined" ? getStoredDesigners() : MOCK_DESIGNERS.map((d) => ({ ...d, status: "approved" }));
  const approved = designers.filter((d) => d.status === "approved" || !d.status);
  
  if (!category || category === "All") return approved;
  return approved.filter((d) => d.category === category);
}

export async function getDesigner(id: string) {
  const designers = typeof window !== "undefined" ? getStoredDesigners() : MOCK_DESIGNERS.map((d) => ({ ...d, status: "approved" }));
  return designers.find((d) => d.id === id) ?? null;
}

