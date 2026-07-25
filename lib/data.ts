import { MOCK_DESIGNERS } from "./mock-data";

// This file is the single seam between UI and storage. Every function below
// currently reads MOCK_DESIGNERS; the commented block shows the Supabase
// query it replaces. Swap the body once `supabase/schema.sql` is applied
// and seeded — the call sites in app/ never need to change.

export async function listDesigners(category?: string) {
  // const supabase = await createClient();
  // let query = supabase.from("designers").select("*, profiles(full_name)").eq("status", "approved");
  // if (category && category !== "All") query = query.contains("categories", [category]);
  // const { data } = await query;
  // return data;
  if (!category || category === "All") return MOCK_DESIGNERS;
  return MOCK_DESIGNERS.filter((d) => d.category === category);
}

export async function getDesigner(id: string) {
  // const supabase = await createClient();
  // const { data } = await supabase.from("designers").select("*, portfolio_items(*)").eq("id", id).single();
  // return data;
  return MOCK_DESIGNERS.find((d) => d.id === id) ?? null;
}
