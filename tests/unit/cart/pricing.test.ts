import { describe, it, expect } from "vitest";
import { calculateShipping, calculateTax, calculateTotals } from "@/server/cart/pricing";

describe("calculateShipping", () => {
  it("charges the flat rate below the free-shipping threshold", () => {
    expect(calculateShipping(74.99)).toBe(9.99);
  });

  it("is free exactly at the threshold", () => {
    expect(calculateShipping(75)).toBe(0);
  });

  it("is free above the threshold", () => {
    expect(calculateShipping(200)).toBe(0);
  });
});

describe("calculateTax", () => {
  it("applies the flat tax rate and rounds to cents", () => {
    expect(calculateTax(100)).toBe(8.25);
  });

  it("rounds correctly on an awkward subtotal", () => {
    expect(calculateTax(19.99)).toBeCloseTo(1.65, 2);
  });

  it("is zero for a zero subtotal", () => {
    expect(calculateTax(0)).toBe(0);
  });
});

describe("calculateTotals", () => {
  it("combines subtotal + shipping + tax correctly under the free-shipping threshold", () => {
    const totals = calculateTotals(50);
    expect(totals).toEqual({ subtotal: 50, shippingCost: 9.99, tax: 4.13, total: 64.12 });
  });

  it("combines subtotal + tax with free shipping above the threshold", () => {
    const totals = calculateTotals(100);
    expect(totals).toEqual({ subtotal: 100, shippingCost: 0, tax: 8.25, total: 108.25 });
  });

  it("rounds the subtotal itself before deriving shipping/tax/total", () => {
    const totals = calculateTotals(19.999);
    expect(totals.subtotal).toBe(20);
  });
});
