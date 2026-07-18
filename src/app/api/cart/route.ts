import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCartSummary, clearCart } from "@/server/cart/cart-service";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await getCartSummary(session.user.id);
  return NextResponse.json({ cart });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await clearCart(session.user.id);
  return NextResponse.json({ cart });
}
