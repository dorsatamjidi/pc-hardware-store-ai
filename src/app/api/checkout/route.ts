import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { placeOrder, CheckoutError } from "@/server/orders/order-service";
import { checkoutSchema } from "@/lib/validation/checkout";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const order = await placeOrder(session.user.id, parsed.data.addressId);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    if (err instanceof CheckoutError) {
      return NextResponse.json({ error: err.message, issues: err.issues }, { status: err.status });
    }
    throw err;
  }
}
