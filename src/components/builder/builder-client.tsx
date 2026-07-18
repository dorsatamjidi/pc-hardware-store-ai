"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BuildSlot, type BuildSlotComponent } from "@/components/builder/build-slot";
import { ProductPickerDialog } from "@/components/builder/product-picker-dialog";
import { CompatibilityReportView, type CompatibilityReportDto } from "@/components/builder/compatibility-report-view";
import { formatPrice } from "@/lib/format";

const STORAGE_KEY = "forgepc:builder:buildId";

const SLOTS: { key: string; label: string }[] = [
  { key: "CPU", label: "CPU" },
  { key: "MOTHERBOARD", label: "Motherboard" },
  { key: "RAM", label: "RAM" },
  { key: "GPU", label: "Graphics Card" },
  { key: "STORAGE", label: "Storage" },
  { key: "PSU", label: "Power Supply" },
  { key: "CASE", label: "Case" },
  { key: "COOLER", label: "CPU Cooler" },
];

interface BuilderApiResponse {
  buildId: string;
  name: string;
  components: { slot: string; quantity: number; product: BuildSlotComponent["product"] }[];
  report: CompatibilityReportDto;
  suggestion?: string | null;
}

export function BuilderClient() {
  const [buildId, setBuildId] = useState<string | null>(null);
  const [components, setComponents] = useState<Record<string, BuildSlotComponent>>({});
  const [report, setReport] = useState<CompatibilityReportDto | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [activeDialogSlot, setActiveDialogSlot] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    fetch(`/api/ai/builder/${stored}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: BuilderApiResponse | null) => {
        if (data) applyResponse(data);
        else window.localStorage.removeItem(STORAGE_KEY);
      })
      .catch(() => window.localStorage.removeItem(STORAGE_KEY));
  }, []);

  function applyResponse(data: BuilderApiResponse) {
    setBuildId(data.buildId);
    window.localStorage.setItem(STORAGE_KEY, data.buildId);
    const next: Record<string, BuildSlotComponent> = {};
    for (const c of data.components) next[c.slot] = { quantity: c.quantity, product: c.product };
    setComponents(next);
    setReport(data.report);
    if (data.suggestion !== undefined) setSuggestion(data.suggestion);
  }

  async function postAction(body: Record<string, unknown>) {
    setIsMutating(true);
    setError(null);
    const response = await fetch("/api/ai/builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buildId: buildId ?? undefined, ...body }),
    });
    const data = await response.json().catch(() => null);
    setIsMutating(false);

    if (!response.ok) {
      setError(data?.error || "Something went wrong.");
      return;
    }
    applyResponse(data);
  }

  function handleSelect(componentType: string, productId: string) {
    void postAction({ action: "add", componentType, productId, quantity: 1 });
  }

  function handleRemove(componentType: string) {
    void postAction({ action: "remove", componentType });
  }

  function handleReset() {
    if (!confirm("Clear the entire build?")) return;
    void postAction({ action: "reset" });
  }

  function handleSuggest() {
    void postAction({ action: "suggest_next" });
  }

  const activeSlot = SLOTS.find((s) => s.key === activeDialogSlot);
  const hasAnyComponent = Object.keys(components).length > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
        {SLOTS.map((slot) => (
          <BuildSlot
            key={slot.key}
            label={slot.label}
            component={components[slot.key] ?? null}
            onAdd={() => setActiveDialogSlot(slot.key)}
            onRemove={() => handleRemove(slot.key)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {report ? (
          <CompatibilityReportView report={report} explanation={suggestion} />
        ) : (
          <p className="text-sm text-muted-foreground">Add components to see compatibility here.</p>
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {report ? <p className="text-right text-lg font-semibold">Total: {formatPrice(report.totalPrice)}</p> : null}

        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={handleSuggest} disabled={isMutating || !hasAnyComponent}>
            What should I add next?
          </Button>
          <Button variant="ghost" onClick={handleReset} disabled={isMutating || !hasAnyComponent}>
            Clear build
          </Button>
        </div>
      </div>

      {activeSlot ? (
        <ProductPickerDialog
          open={!!activeDialogSlot}
          onOpenChange={(open) => !open && setActiveDialogSlot(null)}
          componentType={activeSlot.key}
          label={activeSlot.label}
          onSelect={(productId) => handleSelect(activeSlot.key, productId)}
        />
      ) : null}
    </div>
  );
}
