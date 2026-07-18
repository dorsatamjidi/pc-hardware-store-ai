import type {
  Prisma,
  ProductType,
  CpuSocket,
  RamType,
  FormFactor,
  DriveInterface,
  PsuEfficiency,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ProductSort = "price_asc" | "price_desc" | "newest" | "rating" | "popularity" | "featured";

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  category?: string;
  brand?: string;
  type?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  sort?: ProductSort;
  inStockOnly?: boolean;
  socketType?: CpuSocket;
  ramType?: RamType;
  formFactor?: FormFactor;
  driveInterface?: DriveInterface;
  efficiencyRating?: PsuEfficiency;
}

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 60;

function buildOrderBy(sort: ProductSort | undefined): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return [{ price: "asc" }];
    case "price_desc":
      return [{ price: "desc" }];
    case "newest":
      return [{ releaseYear: "desc" }, { createdAt: "desc" }];
    case "rating":
      return [{ avgRating: "desc" }, { reviewCount: "desc" }];
    case "popularity":
      return [{ reviewCount: "desc" }, { avgRating: "desc" }];
    case "featured":
    default:
      return [{ isFeatured: "desc" }, { avgRating: "desc" }, { reviewCount: "desc" }];
  }
}

function buildWhere(params: ProductListParams): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (params.category) where.category = { slug: params.category };
  if (params.type) where.type = params.type;
  if (params.brand) {
    const slugs = params.brand.split(",").map((s) => s.trim()).filter(Boolean);
    if (slugs.length > 0) where.brand = { slug: { in: slugs } };
  }
  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.price = {
      ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}),
      ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}),
    };
  }
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { shortDescription: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.inStockOnly) where.stockQuantity = { gt: 0 };

  const compatibility: Prisma.ProductCompatibilityWhereInput = {};
  if (params.socketType) compatibility.socketType = params.socketType;
  if (params.ramType) compatibility.ramType = params.ramType;
  if (params.formFactor) compatibility.formFactor = params.formFactor;
  if (params.driveInterface) compatibility.driveInterface = params.driveInterface;
  if (params.efficiencyRating) compatibility.efficiencyRating = params.efficiencyRating;
  if (Object.keys(compatibility).length > 0) where.compatibility = { is: compatibility };

  return where;
}

export async function searchProducts(params: ProductListParams) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  const where = buildWhere(params);
  const orderBy = buildOrderBy(params.sort);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        brand: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
