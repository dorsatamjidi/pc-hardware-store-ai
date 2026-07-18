"use client";

import Link from "next/link";
import { useCompareList } from "@/components/product/use-compare-list";
import { Button, buttonVariants } from "@/components/ui/button";
import { X } from "lucide-react";

export function CompareBar() {
  const { items, toggle, clear } = useCompareList();

  if (items.length === 0) return null;

  const compareHref = `/compare?ids=${items.map((i) => i.slug).join(",")}`;

  return (
    <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <span className="text-sm font-medium">Compare ({items.length})</span>
        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.slug}
              className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted px-2.5 py-1 text-xs"
            >
              {item.name}
              <button onClick={() => toggle(item)} aria-label={`Remove ${item.name} from compare`}>
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear
        </Button>
        {items.length < 2 ? (
          <Button size="sm" disabled>
            Compare now
          </Button>
        ) : (
          <Link href={compareHref} className={buttonVariants({ size: "sm" })}>
            Compare now
          </Link>
        )}
      </div>
    </div>
  );
}
