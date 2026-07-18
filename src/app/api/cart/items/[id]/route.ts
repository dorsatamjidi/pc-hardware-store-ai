import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateItemQuantity, removeItem, CartError } from "@/server/cart/cart-service";
import { updateCartItemSchema } from "@/lib/validation/cart";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const cart = await updateItemQuantity(session.user.id, id, parsed.data.quantity);
    return NextResponse.json({ cart });
  } catch (err) {
    if (err instanceof CartError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const cart = await removeItem(session.user.id, id);
    return NextResponse.json({ cart });
  } catch (err) {
    if (err instanceof CartError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
