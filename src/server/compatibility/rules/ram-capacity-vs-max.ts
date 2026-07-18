import type { Build, RuleResult } from "../types";

export function checkRamCapacityVsMax(build: Build): RuleResult | null {
  const ram = build.RAM;
  const mobo = build.MOTHERBOARD?.product;
  if (!ram || !mobo) return null;

  const specs = ram.product.specs as Record<string, unknown>;
  const capacityGb = typeof specs.capacityGb === "number" ? specs.capacityGb : null;
  const maxCapacity = mobo.compatibility?.maxRamCapacityGb;
  if (!capacityGb || !maxCapacity) return null;

  const totalCapacity = capacityGb * ram.quantity;
  const passed = totalCapacity <= maxCapacity;
  return {
    rule: "ram-capacity-vs-max",
    severity: "ERROR",
    passed,
    message: passed
      ? `${totalCapacity}GB of RAM is within the ${maxCapacity}GB maximum for ${mobo.name}.`
      : `${ram.quantity}x ${ram.product.name} totals ${totalCapacity}GB, which exceeds the ${maxCapacity}GB maximum ${mobo.name} supports.`,
    componentsInvolved: ["RAM", "MOTHERBOARD"],
  };
}
