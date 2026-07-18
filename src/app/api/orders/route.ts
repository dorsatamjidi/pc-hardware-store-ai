import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listOrders } from "@/server/orders/order-service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1) || 1;
  const pageSize = Number(searchParams.get("pageSize") ?? 10) || 10;

  const result = await listOrders(session.user.id, page, pageSize);
  return NextResponse.json(result);
}
