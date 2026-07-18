import type { Build, RuleResult } from "../types";

export function checkRamTypeMotherboard(build: Build): RuleResult | null {
  const ram = build.RAM?.product;
  const mobo = build.MOTHERBOARD?.product;
  if (!ram || !mobo) return null;

  const ramType = ram.compatibility?.ramType;
  const moboRamType = mobo.compatibility?.ramType;
  if (!ramType || !moboRamType) return null;

  const passed = ramType === moboRamType;
  return {
    rule: "ram-type-motherboard",
    severity: "ERROR",
    passed,
    message: passed
      ? `${ram.name} (${ramType}) matches the memory type supported by ${mobo.name}.`
      : `${ram.name} is ${ramType}, but ${mobo.name} only has ${moboRamType} slots. ${ramType} and ${moboRamType} modules are not physically interchangeable.`,
    componentsInvolved: ["RAM", "MOTHERBOARD"],
  };
}
