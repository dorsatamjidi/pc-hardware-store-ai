import { prisma } from "@/lib/prisma";
import type { Build, ComponentSlot } from "@/server/compatibility/types";
import type { CompatibilityCheckInput } from "@/lib/validation/compatibility";

export interface BuildRef {
  productId: string;
  quantity: number;
}

const SLOT_KEYS: Record<ComponentSlot, "cpu" | "motherboard" | "ram" | "gpu" | "psu" | "case" | "cooler" | "storage"> = {
  CPU: "cpu",
  MOTHERBOARD: "motherboard",
  RAM: "ram",
  GPU: "gpu",
  PSU: "psu",
  CASE: "case",
  COOLER: "cooler",
  STORAGE: "storage",
};

export function extractBuildRefs(input: CompatibilityCheckInput): Partial<Record<ComponentSlot, BuildRef>> {
  const refs: Partial<Record<ComponentSlot, BuildRef>> = {};
  for (const [slot, key] of Object.entries(SLOT_KEYS) as [ComponentSlot, keyof CompatibilityCheckInput][]) {
    const productId = input[key];
    if (typeof productId !== "string" || !productId) continue;
    const quantity = slot === "RAM" ? input.ramQuantity ?? 1 : slot === "STORAGE" ? input.storageQuantity ?? 1 : 1;
    refs[slot] = { productId, quantity };
  }
  return refs;
}

/** Loads full Product + ProductCompatibility rows for a set of slot references, for the engine to consume. */
export async function loadBuild(refs: Partial<Record<ComponentSlot, BuildRef>>): Promise<Build> {
  const entries = Object.entries(refs) as [ComponentSlot, BuildRef][];
  if (entries.length === 0) return {};

  const productIds = entries.map(([, ref]) => ref.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { compatibility: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const build: Build = {};
  for (const [slot, ref] of entries) {
    const product = byId.get(ref.productId);
    if (product) build[slot] = { product, quantity: ref.quantity };
  }
  return build;
}
