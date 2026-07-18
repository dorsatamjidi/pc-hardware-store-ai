"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

interface PickerProduct {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  images: { url: string; altText: string }[];
}

export function ProductPickerDialog({
  open,
  onOpenChange,
  componentType,
  label,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentType: string;
  label: string;
  onSelect: (productId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<PickerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      const params = new URLSearchParams({ type: componentType, pageSize: "24" });
      if (query.trim()) params.set("q", query.trim());
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.items ?? []);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [open, query, componentType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a {label}</DialogTitle>
          <DialogDescription>Pick a product to add to this build.</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Search..."
          aria-label={`Search ${label} products`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
          ) : products.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No products found.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {products.map((p) => {
                const image = p.images[0];
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelect(p.id);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 rounded-md p-2 text-left hover:bg-muted"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded bg-muted">
                      {image ? <Image src={image.url} alt={image.altText} fill sizes="48px" className="object-cover" /> : null}
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                    <span className="shrink-0 text-sm font-medium">{formatPrice(p.price)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
