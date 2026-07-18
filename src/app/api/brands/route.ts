import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;

  const brands = await prisma.brand.findMany({
    where: category
      ? { products: { some: { isActive: true, category: { slug: category } } } }
      : { products: { some: { isActive: true } } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, logoUrl: true },
  });

  return NextResponse.json({ brands });
}
