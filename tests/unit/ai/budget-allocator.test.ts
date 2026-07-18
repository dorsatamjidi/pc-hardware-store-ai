import { describe, it, expect } from "vitest";
import { allocateBudget, USE_CASES } from "@/server/ai/recommend/budget-allocator";

describe("allocateBudget", () => {
  it.each(USE_CASES)("allocates the full budget across slots for %s", (useCase) => {
    const budget = 2000;
    const allocation = allocateBudget(useCase, budget);
    const total = Object.values(allocation).reduce((sum, v) => sum + (v ?? 0), 0);
    expect(total).toBeCloseTo(budget, 0);
  });

  it("omits GPU entirely for home_server (0% allocation)", () => {
    const allocation = allocateBudget("home_server", 1000);
    expect(allocation.GPU).toBeUndefined();
  });

  it("gives gaming builds a larger GPU share than office builds", () => {
    const gaming = allocateBudget("gaming", 1500);
    const office = allocateBudget("office", 1500);
    expect(gaming.GPU!).toBeGreaterThan(office.GPU!);
  });

  it("scales linearly with budget", () => {
    const small = allocateBudget("gaming", 1000);
    const large = allocateBudget("gaming", 2000);
    expect(large.CPU!).toBeCloseTo(small.CPU! * 2, 5);
  });
});
