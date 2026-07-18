const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Accepts number/string/Prisma.Decimal (or anything numeric-stringifiable). */
export function formatPrice(value: number | string | { toString(): string }): string {
  return currencyFormatter.format(Number(value));
}

export function humanizeKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export function humanizeValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.map((v) => humanizeValue(v)).join(", ");
  return String(value);
}
