/**
 * Flat-rate tax and shipping tiers — checkout is simulated, not a real
 * payment/tax/carrier integration, so approximate values are used
 * deliberately. See docs/future-improvements.md.
 */
const TAX_RATE = 0.0825;
const FREE_SHIPPING_THRESHOLD = 75;
const FLAT_SHIPPING_COST = 9.99;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
}

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

export interface OrderTotals {
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export function calculateTotals(subtotal: number): OrderTotals {
  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const shippingCost = calculateShipping(roundedSubtotal);
  const tax = calculateTax(roundedSubtotal);
  const total = Math.round((roundedSubtotal + shippingCost + tax) * 100) / 100;
  return { subtotal: roundedSubtotal, shippingCost, tax, total };
}
