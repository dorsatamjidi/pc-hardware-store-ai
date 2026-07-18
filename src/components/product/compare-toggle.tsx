"use client";

import { toast } from "sonner";
import { useCompareList } from "@/components/product/use-compare-list";
import { cn } from "@/lib/utils";

export function CompareToggle({
  slug,
  name,
  type,
  className,
}: {
  slug: string;
  name: string;
  type: string;
  className?: string;
}) {
  const { isSelected, toggle } = useCompareList();
  const selected = isSelected(slug);

  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground select-none",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={selected}
        className="size-3.5 rounded border-border"
        onChange={() => {
          const next = toggle({ slug, name, type });
          if (!selected && next.length > 0 && !next.some((i) => i.slug === slug)) {
            toast.info("Compare is limited to items of the same category.");
          }
        }}
      />
      Compare
    </label>
  );
}
