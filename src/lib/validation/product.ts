import { z } from "zod";

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(60).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  type: z
    .enum([
      "CPU", "MOTHERBOARD", "RAM", "GPU", "STORAGE", "PSU", "CASE", "COOLER", "FAN",
      "MONITOR", "KEYBOARD", "MOUSE", "HEADSET", "NETWORK_CARD", "CABLE", "THERMAL_PASTE",
    ])
    .optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  q: z.string().trim().min(1).max(100).optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "rating", "popularity", "featured"]).optional(),
  inStockOnly: z.coerce.boolean().optional(),
  socketType: z.enum(["AM4", "AM5", "LGA1200", "LGA1700", "LGA1851"]).optional(),
  ramType: z.enum(["DDR4", "DDR5"]).optional(),
  formFactor: z.enum(["E_ATX", "ATX", "MICRO_ATX", "MINI_ITX"]).optional(),
  driveInterface: z.enum(["SATA_3", "NVME_PCIE3_X4", "NVME_PCIE4_X4", "NVME_PCIE5_X4"]).optional(),
  efficiencyRating: z.enum(["WHITE", "BRONZE", "SILVER", "GOLD", "PLATINUM", "TITANIUM"]).optional(),
});

export function parseProductListParams(searchParams: URLSearchParams | Record<string, string | string[] | undefined>) {
  const record =
    searchParams instanceof URLSearchParams
      ? Object.fromEntries(searchParams.entries())
      : Object.fromEntries(
          Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
        );

  return productListQuerySchema.parse(record);
}
