"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompatibilityReportView, type CompatibilityReportDto } from "@/components/builder/compatibility-report-view";
import { formatPrice, humanizeKey } from "@/lib/format";

const USE_CASE_OPTIONS = [
  { value: "gaming", label: "Gaming PC" },
  { value: "office", label: "Office PC" },
  { value: "ai_workstation", label: "AI Workstation" },
  { value: "video_editing", label: "Video Editing" },
  { value: "programming", label: "Programming" },
  { value: "home_server", label: "Home Server" },
];

interface RecommendedComponent {
  slot: string;
  quantity: number;
  product: {
    slug: string;
    name: string;
    price: string | number;
    images: { url: string; altText: string }[];
  };
}

interface RecommendResult {
  components: RecommendedComponent[];
  report: CompatibilityReportDto;
  rationale: string;
}

export function RecommendForm() {
  const [useCase, setUseCase] = useState("gaming");
  const [budget, setBudget] = useState("1200");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await fetch("/api/ai/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ useCase, budget: Number(budget) }),
    });

    const data = await response.json().catch(() => null);
    setIsLoading(false);

    if (!response.ok) {
      setError(data?.error || "Couldn't generate a recommendation. Try again.");
      return;
    }

    setResult(data);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label>What&apos;s it for?</Label>
          <Select value={useCase} onValueChange={(v) => v && setUseCase(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USE_CASE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="budget">Budget (USD)</Label>
          <Input id="budget" type="number" min={200} max={20000} value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Building..." : "Get recommendation"}
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {result ? (
        <div className="flex flex-col gap-6">
          <CompatibilityReportView report={result.report} explanation={result.rationale} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.components.map((c) => {
              const image = c.product.images[0];
              return (
                <Link
                  key={c.slot}
                  href={`/products/${c.product.slug}`}
                  className="flex gap-3 rounded-lg border border-border/60 p-3 hover:bg-muted/50"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {image ? <Image src={image.url} alt={image.altText} fill sizes="64px" className="object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{humanizeKey(c.slot)}</p>
                    <p className="truncate text-sm font-medium">
                      {c.quantity > 1 ? `${c.quantity}x ` : ""}
                      {c.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatPrice(c.product.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="text-right text-lg font-semibold">Total: {formatPrice(result.report.totalPrice)}</p>
        </div>
      ) : null}
    </div>
  );
}
