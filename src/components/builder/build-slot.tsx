"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export interface BuildSlotComponent {
  quantity: number;
  product: {
    slug: string;
    name: string;
    price: string | number;
    images: { url: string; altText: string }[];
  };
}

export function BuildSlot({
  label,
  component,
  onAdd,
  onRemove,
}: {
  label: string;
  component: BuildSlotComponent | null;
  onAdd: () => void;
  onRemove: () => void;
}) {
  if (!component) {
    return (
      <button
        onClick={onAdd}
        className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-border/60 p-3 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
      >
        <span>{label}</span>
        <Plus className="size-4" />
      </button>
    );
  }

  const image = component.product.images[0];

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
      <div className="relative size-12 shrink-0 overflow-hidden rounded bg-muted">
        {image ? <Image src={image.url} alt={image.altText} fill sizes="48px" className="object-cover" /> : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">
          {label}
          {component.quantity > 1 ? ` × ${component.quantity}` : ""}
        </p>
        <Link href={`/products/${component.product.slug}`} className="block truncate text-sm font-medium hover:underline">
          {component.product.name}
        </Link>
        <p className="text-sm text-muted-foreground">{formatPrice(component.product.price)}</p>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={onRemove} aria-label={`Remove ${label}`}>
        <X className="size-4" />
      </Button>
    </div>
  );
}
