"use client";
import { useRouter } from "next/navigation";
import CategoryChips from "@/components/user/CategoryChips";

export default function CategoryChipsClient({ activeCategory }: { activeCategory: string }) {
  const router = useRouter();
  return (
    <CategoryChips
      active={activeCategory}
      onChange={(cat) => router.push(`/user/browse?category=${encodeURIComponent(cat)}`)}
    />
  );
}
