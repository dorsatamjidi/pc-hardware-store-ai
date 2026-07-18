import { NextResponse } from "next/server";
import { searchProducts } from "@/server/catalog/search";
import { parseProductListParams } from "@/lib/validation/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let parsed;
  try {
    parsed = parseProductListParams(searchParams);
  } catch {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  const result = await searchProducts(parsed);
  return NextResponse.json(result);
}
