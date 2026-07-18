"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FilterCategory {
  slug: string;
  name: string;
  productCount: number;
}

export interface FilterBrand {
  slug: string;
  name: string;
}

const CATEGORY_FILTERS: Record<string, Array<{ key: string; label: string; options: string[] }>> = {
  cpus: [{ key: "socketType", label: "Socket", options: ["AM4", "AM5", "LGA1200", "LGA1700", "LGA1851"] }],
  motherboards: [
    { key: "socketType", label: "Socket", options: ["AM4", "AM5", "LGA1200", "LGA1700", "LGA1851"] },
    { key: "ramType", label: "RAM Type", options: ["DDR4", "DDR5"] },
    { key: "formFactor", label: "Form Factor", options: ["E_ATX", "ATX", "MICRO_ATX", "MINI_ITX"] },
  ],
  memory: [{ key: "ramType", label: "RAM Type", options: ["DDR4", "DDR5"] }],
  storage: [
    {
      key: "driveInterface",
      label: "Interface",
      options: ["SATA_3", "NVME_PCIE3_X4", "NVME_PCIE4_X4", "NVME_PCIE5_X4"],
    },
  ],
  "power-supplies": [
    { key: "efficiencyRating", label: "Efficiency", options: ["BRONZE", "GOLD", "PLATINUM", "TITANIUM"] },
  ],
  cases: [{ key: "formFactor", label: "Form Factor", options: ["E_ATX", "ATX", "MICRO_ATX", "MINI_ITX"] }],
};

export function FilterSidebar({
  categories,
  brands,
}: {
  categories: FilterCategory[];
  brands: FilterBrand[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeBrands = new Set((searchParams.get("brand") || "").split(",").filter(Boolean));
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  function updateParams(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleBrand(slug: string) {
    updateParams((params) => {
      const current = new Set((params.get("brand") || "").split(",").filter(Boolean));
      if (current.has(slug)) current.delete(slug);
      else current.add(slug);
      if (current.size > 0) params.set("brand", Array.from(current).join(","));
      else params.delete("brand");
    });
  }

  function toggleSpecFilter(key: string, value: string) {
    updateParams((params) => {
      if (params.get(key) === value) params.delete(key);
      else params.set(key, value);
    });
  }

  function applyPriceRange() {
    updateParams((params) => {
      if (minPrice) params.set("minPrice", minPrice);
      else params.delete("minPrice");
      if (maxPrice) params.set("maxPrice", maxPrice);
      else params.delete("maxPrice");
    });
  }

  function clearAll() {
    router.push(pathname);
  }

  const specFilters = activeCategory ? CATEGORY_FILTERS[activeCategory] || [] : [];

  return (
    <aside className="flex w-full flex-col gap-6 lg:w-64 lg:shrink-0">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Category</h3>
          {searchParams.toString() ? (
            <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">
              Clear all
            </button>
          ) : null}
        </div>
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href={pathname}
              className={cn(
                "flex justify-between rounded px-2 py-1.5 text-sm hover:bg-muted",
                !activeCategory && "bg-muted font-medium",
              )}
            >
              All categories
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`${pathname}?category=${c.slug}`}
                className={cn(
                  "flex justify-between rounded px-2 py-1.5 text-sm hover:bg-muted",
                  activeCategory === c.slug && "bg-muted font-medium",
                )}
              >
                <span>{c.name}</span>
                <span className="text-muted-foreground">{c.productCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Price</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            aria-label="Minimum price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-8"
          />
          <span aria-hidden className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            aria-label="Maximum price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-8"
          />
        </div>
        <Button size="sm" variant="outline" className="mt-2 w-full" onClick={applyPriceRange}>
          Apply
        </Button>
      </div>

      {brands.length > 0 ? (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Brand</h3>
          <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto pr-1">
            {brands.map((b) => (
              <Label key={b.slug} className="flex items-center gap-2 text-sm font-normal">
                <input
                  type="checkbox"
                  className="size-3.5 rounded border-border"
                  checked={activeBrands.has(b.slug)}
                  onChange={() => toggleBrand(b.slug)}
                />
                {b.name}
              </Label>
            ))}
          </div>
        </div>
      ) : null}

      {specFilters.map((filter) => (
        <div key={filter.key}>
          <h3 className="mb-2 text-sm font-semibold">{filter.label}</h3>
          <div className="flex flex-wrap gap-1.5">
            {filter.options.map((option) => {
              const active = searchParams.get(filter.key) === option;
              return (
                <button
                  key={option}
                  onClick={() => toggleSpecFilter(filter.key, option)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-muted-foreground hover:border-foreground/40",
                  )}
                >
                  {option.replace(/_/g, " ")}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
