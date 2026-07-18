import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { allocateBudget, type UseCase } from "@/server/ai/recommend/budget-allocator";
import type { Build, ComponentSlot, ProductWithCompatibility } from "@/server/compatibility/types";

async function findBestFit(
  type: ComponentSlot,
  maxPrice: number,
  extraWhere: Prisma.ProductWhereInput = {},
): Promise<ProductWithCompatibility | null> {
  const inBudget = await prisma.product.findFirst({
    where: { type, isActive: true, stockQuantity: { gt: 0 }, price: { lte: maxPrice }, ...extraWhere },
    orderBy: [{ avgRating: "desc" }, { reviewCount: "desc" }],
    include: { compatibility: true },
  });
  if (inBudget) return inBudget;

  // Nothing fits the allocated slice of the budget — better to include the
  // cheapest compatible option than to leave the slot empty.
  return prisma.product.findFirst({
    where: { type, isActive: true, stockQuantity: { gt: 0 }, ...extraWhere },
    orderBy: [{ price: "asc" }],
    include: { compatibility: true },
  });
}

/**
 * Constructively builds a *compatible* set of components for a budget —
 * each slot after the first is filtered by the constraints of what's
 * already chosen (CPU socket -> motherboard, motherboard RAM type -> RAM,
 * CPU socket -> cooler, motherboard form factor -> case, estimated wattage
 * -> PSU) — rather than picking independently and hoping they match.
 */
export async function selectBuildForUseCase(useCase: UseCase, budget: number): Promise<Build> {
  const allocation = allocateBudget(useCase, budget);
  const build: Build = {};

  if (allocation.CPU) {
    const cpu = await findBestFit("CPU", allocation.CPU);
    if (cpu) build.CPU = { product: cpu, quantity: 1 };
  }

  if (allocation.MOTHERBOARD) {
    const socket = build.CPU?.product.compatibility?.socketType;
    const mobo = await findBestFit(
      "MOTHERBOARD",
      allocation.MOTHERBOARD,
      socket ? { compatibility: { is: { socketType: socket } } } : {},
    );
    if (mobo) build.MOTHERBOARD = { product: mobo, quantity: 1 };
  }

  if (allocation.RAM) {
    const ramType = build.MOTHERBOARD?.product.compatibility?.ramType;
    const ram = await findBestFit("RAM", allocation.RAM, ramType ? { compatibility: { is: { ramType } } } : {});
    if (ram) build.RAM = { product: ram, quantity: 1 };
  }

  if (allocation.GPU) {
    const gpu = await findBestFit("GPU", allocation.GPU);
    if (gpu) build.GPU = { product: gpu, quantity: 1 };
  }

  if (allocation.STORAGE) {
    const storage = await findBestFit("STORAGE", allocation.STORAGE);
    if (storage) build.STORAGE = { product: storage, quantity: 1 };
  }

  if (allocation.PSU) {
    const cpuTdp = build.CPU?.product.compatibility?.tdpWatts ?? 0;
    const gpuDraw = build.GPU?.product.compatibility?.powerDrawWatts ?? 0;
    const minWattage = Math.ceil((cpuTdp + gpuDraw + 100) * 1.2);
    const psu =
      (await findBestFit("PSU", allocation.PSU, { compatibility: { is: { wattageCapacity: { gte: minWattage } } } })) ??
      (await findBestFit("PSU", allocation.PSU));
    if (psu) build.PSU = { product: psu, quantity: 1 };
  }

  if (allocation.CASE) {
    const formFactor = build.MOTHERBOARD?.product.compatibility?.formFactor;
    const pcCase = await findBestFit(
      "CASE",
      allocation.CASE,
      formFactor ? { compatibility: { is: { caseSupportedFormFactors: { has: formFactor } } } } : {},
    );
    if (pcCase) build.CASE = { product: pcCase, quantity: 1 };
  }

  if (allocation.COOLER) {
    const socket = build.CPU?.product.compatibility?.socketType;
    const cooler = await findBestFit(
      "COOLER",
      allocation.COOLER,
      socket ? { compatibility: { is: { coolerSupportedSockets: { has: socket } } } } : {},
    );
    if (cooler) build.COOLER = { product: cooler, quantity: 1 };
  }

  return build;
}
