import BrowseClient from "./browse-client";

export default async function BrowsePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "All" } = await searchParams;
  return <BrowseClient initialCategory={category} />;
}
