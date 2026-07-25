import DesignerDetailClient from "./designer-detail-client";

export default async function DesignerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DesignerDetailClient id={id} />;
}
