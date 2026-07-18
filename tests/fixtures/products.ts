import type { ProductWithCompatibility, BuildComponent } from "@/server/compatibility/types";

let counter = 0;

/** Minimal product fixture for compatibility-engine unit tests. Only the fields
 * the rules actually read need to be realistic; everything else is filler. */
export function makeProduct(overrides: {
  name?: string;
  type?: string;
  price?: number;
  specs?: Record<string, unknown>;
  compatibility?: Record<string, unknown>;
}): ProductWithCompatibility {
  counter += 1;
  const id = `test-product-${counter}`;

  return {
    id,
    slug: id,
    sku: id.toUpperCase(),
    name: overrides.name ?? `Test Product ${counter}`,
    type: (overrides.type ?? "CPU") as never,
    categoryId: "test-category",
    brandId: "test-brand",
    description: "",
    shortDescription: "",
    price: (overrides.price ?? 100) as never,
    compareAtPrice: null,
    stockQuantity: 10,
    isActive: true,
    isFeatured: false,
    specs: (overrides.specs ?? {}) as never,
    releaseYear: 2024,
    avgRating: 0 as never,
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    compatibility: overrides.compatibility
      ? ({
          id: `${id}-compat`,
          productId: id,
          socketType: null,
          chipset: null,
          ramType: null,
          ramSpeedMhz: null,
          maxRamCapacityGb: null,
          maxRamSlots: null,
          formFactor: null,
          pcieVersion: null,
          pcieLanes: null,
          tdpWatts: null,
          powerDrawWatts: null,
          wattageCapacity: null,
          efficiencyRating: null,
          coolerSupportedSockets: [],
          driveInterface: null,
          caseMaxGpuLengthMm: null,
          caseMaxCoolerHeightMm: null,
          caseSupportedFormFactors: [],
          gpuLengthMm: null,
          ...overrides.compatibility,
        } as never)
      : null,
  };
}

export function makeComponent(overrides: Parameters<typeof makeProduct>[0], quantity = 1): BuildComponent {
  return { product: makeProduct(overrides), quantity };
}
