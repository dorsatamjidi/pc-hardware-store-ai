import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../src/lib/prisma";
import { Rng } from "./generators/rng";
import { categories } from "./data/categories";
import { brands } from "./data/brands";
import { buildAllProducts, type ProductSeedInput } from "./generators/catalog";
import { buildPlaceholderImageUrl } from "./generators/placeholder-image";
import { generateReviews } from "./generators/reviews";
import { embedAndStoreProducts, buildEmbeddingSourceText } from "./embed";

const SEED = 42;
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";
const REVIEWER_COUNT = 50;
const DEMO_PASSWORD = "Password123!";

const rng = new Rng(SEED);

function stockRangeForTier(tier: ProductSeedInput["tier"]): [number, number] {
  switch (tier) {
    case "budget":
      return [20, 150];
    case "mid":
      return [15, 90];
    case "high":
      return [5, 45];
    case "enthusiast":
      return [0, 20];
  }
}

async function seedCategories() {
  const idBySlug = new Map<string, string>();
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, sortOrder: c.sortOrder },
      create: { name: c.name, slug: c.slug, description: c.description, sortOrder: c.sortOrder },
    });
    idBySlug.set(c.type, row.id);
  }
  return idBySlug;
}

async function seedBrands() {
  const idByName = new Map<string, string>();
  for (const b of brands) {
    const row = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, description: b.description },
      create: { name: b.name, slug: b.slug, description: b.description },
    });
    idByName.set(b.name, row.id);
  }
  return idByName;
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@forgepc.dev" },
    update: {},
    create: {
      name: "Demo Shopper",
      email: "demo@forgepc.dev",
      passwordHash,
      role: "CUSTOMER",
    },
  });

  const reviewerIds: string[] = [];
  for (let i = 1; i <= REVIEWER_COUNT; i++) {
    const email = `reviewer${String(i).padStart(3, "0")}@seed.forgepc.dev`;
    const name = `${rng.pick(["Alex", "Jordan", "Taylor", "Sam", "Morgan", "Casey", "Riley", "Jamie"])} ${rng.pick(["A.", "B.", "C.", "D.", "E.", "F."])}`;
    const row = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, passwordHash, role: "CUSTOMER" },
    });
    reviewerIds.push(row.id);
  }

  console.log(`Seeded ${reviewerIds.length + 1} users (1 demo login + ${reviewerIds.length} reviewers).`);
  console.log(`  Demo login: demo@forgepc.dev / ${DEMO_PASSWORD}`);

  return { demoUserId: demoUser.id, reviewerIds };
}

async function seedProducts(
  categoryIdByType: Map<string, string>,
  brandIdByName: Map<string, string>,
  reviewerIds: string[],
) {
  const allProducts = buildAllProducts();
  const embeddingInputs: Array<{ productId: string; sourceText: string }> = [];

  let skuCounter = 1;
  let totalReviews = 0;

  for (const input of allProducts) {
    const categoryId = categoryIdByType.get(input.type);
    const brandId = brandIdByName.get(input.brand);
    if (!categoryId) throw new Error(`No category seeded for type ${input.type}`);
    if (!brandId) throw new Error(`No brand seeded for name ${input.brand}`);

    const sku = `SKU-${input.type}-${String(skuCounter++).padStart(5, "0")}`;
    const [stockMin, stockMax] = stockRangeForTier(input.tier);
    const stockQuantity = rng.int(stockMin, stockMax);
    const hasDiscount = rng.bool(0.15);
    const compareAtPrice = hasDiscount ? Math.round(input.price * rng.float(1.05, 1.25) * 100) / 100 : null;
    const isFeatured = rng.bool(0.08);

    const product = await prisma.product.upsert({
      where: { slug: input.slug },
      update: {
        name: input.name,
        type: input.type,
        categoryId,
        brandId,
        description: input.description,
        shortDescription: input.shortDescription,
        price: input.price,
        compareAtPrice,
        stockQuantity,
        isFeatured,
        specs: input.specs as Prisma.InputJsonObject,
        releaseYear: input.releaseYear,
      },
      create: {
        slug: input.slug,
        sku,
        name: input.name,
        type: input.type,
        categoryId,
        brandId,
        description: input.description,
        shortDescription: input.shortDescription,
        price: input.price,
        compareAtPrice,
        stockQuantity,
        isFeatured,
        specs: input.specs as Prisma.InputJsonObject,
        releaseYear: input.releaseYear,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: buildPlaceholderImageUrl(product.type, product.name),
        altText: product.name,
        sortOrder: 0,
        isPrimary: true,
      },
    });

    await prisma.productCompatibility.upsert({
      where: { productId: product.id },
      update: { ...input.compatibility },
      create: { productId: product.id, ...input.compatibility },
    });

    const reviewCount = rng.int(0, 40);
    await prisma.review.deleteMany({ where: { productId: product.id } });
    if (reviewCount > 0) {
      const reviews = generateReviews(rng, input.name, reviewerIds, reviewCount, input.releaseYear);
      await prisma.review.createMany({
        data: reviews.map((r) => ({
          productId: product.id,
          userId: r.userId,
          rating: r.rating,
          title: r.title,
          body: r.body,
          isVerifiedPurchase: r.isVerifiedPurchase,
          createdAt: r.createdAt,
        })),
        skipDuplicates: true,
      });
      totalReviews += reviews.length;

      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await prisma.product.update({
        where: { id: product.id },
        data: { avgRating: Math.round(avgRating * 100) / 100, reviewCount: reviews.length },
      });
    } else {
      await prisma.product.update({ where: { id: product.id }, data: { avgRating: 0, reviewCount: 0 } });
    }

    const categoryName = categories.find((c) => c.type === input.type)!.name;
    embeddingInputs.push({
      productId: product.id,
      sourceText: buildEmbeddingSourceText({
        name: product.name,
        brandName: input.brand,
        categoryName,
        type: input.type,
        description: input.description,
        price: input.price,
        specs: input.specs as Prisma.InputJsonObject,
      }),
    });
  }

  console.log(`Seeded ${allProducts.length} products (${totalReviews} reviews).`);
  return embeddingInputs;
}

async function main() {
  console.log("Seeding categories...");
  const categoryIdByType = await seedCategories();

  console.log("Seeding brands...");
  const brandIdByName = await seedBrands();

  console.log("Seeding users...");
  const { reviewerIds } = await seedUsers();

  console.log("Seeding products, images, compatibility, and reviews...");
  const embeddingInputs = await seedProducts(categoryIdByType, brandIdByName, reviewerIds);

  console.log(`Generating embeddings for ${embeddingInputs.length} products (this loads a local model on first run)...`);
  await embedAndStoreProducts(embeddingInputs, EMBEDDING_MODEL);

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
