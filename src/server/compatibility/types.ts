import type { Product, ProductCompatibility } from "@prisma/client";

export type ComponentSlot = "CPU" | "MOTHERBOARD" | "RAM" | "GPU" | "STORAGE" | "PSU" | "CASE" | "COOLER";

export const COMPONENT_SLOTS: ComponentSlot[] = [
  "CPU",
  "MOTHERBOARD",
  "RAM",
  "GPU",
  "STORAGE",
  "PSU",
  "CASE",
  "COOLER",
];

export type ProductWithCompatibility = Product & { compatibility: ProductCompatibility | null };

export interface BuildComponent {
  product: ProductWithCompatibility;
  quantity: number;
}

/**
 * One product per slot, with a quantity (e.g. 2x identical RAM kits or 2x
 * identical storage drives). Mixing different products of the same type in
 * one build is out of scope — see docs/future-improvements.md.
 */
export type Build = Partial<Record<ComponentSlot, BuildComponent>>;

export type Severity = "ERROR" | "WARNING" | "INFO";

export interface RuleResult {
  rule: string;
  severity: Severity;
  passed: boolean;
  message: string;
  componentsInvolved: ComponentSlot[];
}

export type CompatibilityStatus = "COMPATIBLE" | "COMPATIBLE_WITH_WARNINGS" | "INCOMPATIBLE";

export interface CompatibilityReport {
  status: CompatibilityStatus;
  results: RuleResult[];
  estimatedWattage: number | null;
  totalPrice: number;
}

export type CompatibilityRule = (build: Build) => RuleResult | null;
