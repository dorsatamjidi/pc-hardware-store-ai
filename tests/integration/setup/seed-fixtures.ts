import { PrismaClient } from "@prisma/client";
import { FIXTURE } from "./constants";

/** Minimal, deterministic fixture data integration tests build on top of. Idempotent (upserts by natural key). */
export async function seedFixtures(prisma: PrismaClient) {
  const category = async (slug: string, name: string, sortOrder: number) =>
    prisma.category.upsert({
      where: { slug },
      update: {},
      create: { slug, name, sortOrder },
    });

  const [cpuCategory, moboCategory, ramCategory] = await Promise.all([
    category(FIXTURE.categorySlugs.cpu, "Processors", 0),
    category(FIXTURE.categorySlugs.motherboard, "Motherboards", 1),
    category(FIXTURE.categorySlugs.ram, "Memory", 2),
  ]);

  const brand = await prisma.brand.upsert({
    where: { slug: FIXTURE.brandSlug },
    update: {},
    create: { slug: FIXTURE.brandSlug, name: "TestBrand" },
  });

  async function product(input: {
    slug: string;
    name: string;
    type: "CPU" | "MOTHERBOARD" | "RAM" | "STORAGE";
    categoryId: string;
    price: number;
    stockQuantity: number;
    isActive?: boolean;
    specs?: Record<string, unknown>;
    compatibility?: Record<string, unknown>;
  }) {
    const created = await prisma.product.upsert({
      where: { slug: input.slug },
      update: {
        price: input.price,
        stockQuantity: input.stockQuantity,
        isActive: input.isActive ?? true,
        specs: (input.specs ?? {}) as never,
      },
      create: {
        slug: input.slug,
        sku: input.slug.toUpperCase(),
        name: input.name,
        type: input.type,
        categoryId: input.categoryId,
        brandId: brand.id,
        description: `${input.name} — integration test fixture.`,
        shortDescription: "Integration test fixture.",
        price: input.price,
        stockQuantity: input.stockQuantity,
        isActive: input.isActive ?? true,
        specs: (input.specs ?? {}) as never,
      },
    });

    if (input.compatibility) {
      await prisma.productCompatibility.upsert({
        where: { productId: created.id },
        update: input.compatibility,
        create: { productId: created.id, ...input.compatibility },
      });
    }

    return created;
  }

  await Promise.all([
    product({
      slug: FIXTURE.products.cpuAm5,
      name: "Test CPU AM5",
      type: "CPU",
      categoryId: cpuCategory.id,
      price: 300,
      stockQuantity: 10,
      compatibility: { socketType: "AM5", tdpWatts: 105 },
    }),
    product({
      slug: FIXTURE.products.cpuAm4,
      name: "Test CPU AM4",
      type: "CPU",
      categoryId: cpuCategory.id,
      price: 150,
      stockQuantity: 10,
      compatibility: { socketType: "AM4", tdpWatts: 65 },
    }),
    product({
      slug: FIXTURE.products.moboAm5Ddr5,
      name: "Test Motherboard AM5 DDR5",
      type: "MOTHERBOARD",
      categoryId: moboCategory.id,
      price: 200,
      stockQuantity: 5,
      specs: { m2Slots: 2, sataPorts: 4 },
      compatibility: {
        socketType: "AM5",
        ramType: "DDR5",
        ramSpeedMhz: 6000,
        maxRamCapacityGb: 128,
        maxRamSlots: 4,
        formFactor: "ATX",
      },
    }),
    product({
      slug: FIXTURE.products.moboAm4Ddr4,
      name: "Test Motherboard AM4 DDR4",
      type: "MOTHERBOARD",
      categoryId: moboCategory.id,
      price: 100,
      stockQuantity: 5,
      specs: { m2Slots: 1, sataPorts: 4 },
      compatibility: {
        socketType: "AM4",
        ramType: "DDR4",
        ramSpeedMhz: 3200,
        maxRamCapacityGb: 64,
        maxRamSlots: 2,
        formFactor: "MICRO_ATX",
      },
    }),
    product({
      slug: FIXTURE.products.ramDdr5,
      name: "Test RAM DDR5",
      type: "RAM",
      categoryId: ramCategory.id,
      price: 80,
      stockQuantity: 20,
      specs: { capacityGb: 32, kit: "2x16GB" },
      compatibility: { ramType: "DDR5", ramSpeedMhz: 5600 },
    }),
    product({
      slug: FIXTURE.products.outOfStock,
      name: "Test Out Of Stock CPU",
      type: "CPU",
      categoryId: cpuCategory.id,
      price: 250,
      stockQuantity: 0,
      compatibility: { socketType: "AM5", tdpWatts: 95 },
    }),
    product({
      slug: FIXTURE.products.lowStock,
      name: "Test Low Stock Storage",
      type: "STORAGE",
      categoryId: cpuCategory.id,
      price: 50,
      stockQuantity: 2,
    }),
  ]);
}
