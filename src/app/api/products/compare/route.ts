import { NextResponse } from "next/server";
import { getProductsForCompare } from "@/server/catalog/compare";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");
  if (!idsParam) return NextResponse.json({ error: "Missing 'ids' query parameter" }, { status: 400 });

  const slugs = idsParam.split(",");
  const result = await getProductsForCompare(slugs);
  if (result.products.length === 0) {
    return NextResponse.json({ error: "No matching products found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
