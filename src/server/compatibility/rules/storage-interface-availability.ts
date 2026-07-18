import type { Build, RuleResult } from "../types";

/**
 * Simplified check: counts drives of one interface type against the
 * motherboard's advertised slot count. Does not model shared PCIe lanes,
 * chipset-vs-CPU-attached M.2 slots, or M.2/SATA combo-port restrictions —
 * see docs/future-improvements.md.
 */
export function checkStorageInterfaceAvailability(build: Build): RuleResult | null {
  const storage = build.STORAGE;
  const mobo = build.MOTHERBOARD?.product;
  if (!storage || !mobo) return null;

  const driveInterface = storage.product.compatibility?.driveInterface;
  if (!driveInterface) return null;

  const moboSpecs = mobo.specs as Record<string, unknown>;
  const isNvme = driveInterface !== "SATA_3";
  const availableRaw = isNvme ? moboSpecs.m2Slots : moboSpecs.sataPorts;
  const available = typeof availableRaw === "number" ? availableRaw : null;
  if (available === null) return null;

  const needed = storage.quantity;
  const passed = needed <= available;
  return {
    rule: "storage-interface-availability",
    severity: "WARNING",
    passed,
    message: passed
      ? `${mobo.name} has enough ${isNvme ? "M.2" : "SATA"} connectivity for ${needed} drive(s) like ${storage.product.name}.`
      : `You're adding ${needed}x ${storage.product.name}, but ${mobo.name} only lists ${available} ${isNvme ? "M.2 slot(s)" : "SATA port(s)"} (a simplified check, not full slot/lane modeling).`,
    componentsInvolved: ["STORAGE", "MOTHERBOARD"],
  };
}
