import { humanizeKey, humanizeValue } from "@/lib/format";
import { ExplainButton } from "@/components/product/explain-button";

export function SpecTable({ specs, productId }: { specs: Record<string, unknown>; productId?: string }) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <dl className="divide-y divide-border/60 rounded-lg border border-border/60">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            {humanizeKey(key)}
            {productId ? <ExplainButton target={{ productId, field: key }} /> : null}
          </dt>
          <dd className="text-right font-medium">{humanizeValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}
