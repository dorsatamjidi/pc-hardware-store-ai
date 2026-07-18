import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addItem, CartError } from "@/server/cart/cart-service";
import { addCartItemSchema } from "@/lib/validation/cart";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = addCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const cart = await addItem(session.user.id, parsed.data.productId, parsed.data.quantity);
    return NextResponse.json({ cart }, { status: 201 });
  } catch (err) {
    if (err instanceof CartError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
