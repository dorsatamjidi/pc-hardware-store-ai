import type { Build, RuleResult } from "../types";

function parseModuleCount(kit: unknown): number | null {
  if (typeof kit !== "string") return null;
  const match = kit.match(/^(\d+)\s*x/i);
  return match ? Number(match[1]) : null;
}

export function checkRamModuleCountVsSlots(build: Build): RuleResult | null {
  const ram = build.RAM;
  const mobo = build.MOTHERBOARD?.product;
  if (!ram || !mobo) return null;

  const specs = ram.product.specs as Record<string, unknown>;
  const modulesPerKit = parseModuleCount(specs.kit);
  const maxSlots = mobo.compatibility?.maxRamSlots;
  if (!modulesPerKit || !maxSlots) return null;

  const totalModules = modulesPerKit * ram.quantity;
  const passed = totalModules <= maxSlots;
  return {
    rule: "ram-module-count-vs-slots",
    severity: "ERROR",
    passed,
    message: passed
      ? `${totalModules} memory module(s) fit within the ${maxSlots} slots on ${mobo.name}.`
      : `${ram.quantity}x ${ram.product.name} (${specs.kit} each) needs ${totalModules} physical slots, but ${mobo.name} only has ${maxSlots}.`,
    componentsInvolved: ["RAM", "MOTHERBOARD"],
  };
}
