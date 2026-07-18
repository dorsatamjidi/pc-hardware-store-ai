import type { Build, RuleResult } from "../types";

export function checkRamSpeedSupport(build: Build): RuleResult | null {
  const ram = build.RAM?.product;
  const mobo = build.MOTHERBOARD?.product;
  if (!ram || !mobo) return null;

  const ramSpeed = ram.compatibility?.ramSpeedMhz;
  const moboMaxSpeed = mobo.compatibility?.ramSpeedMhz;
  if (!ramSpeed || !moboMaxSpeed) return null;

  const passed = ramSpeed <= moboMaxSpeed;
  return {
    rule: "ram-speed-support",
    severity: "WARNING",
    passed,
    message: passed
      ? `${mobo.name} officially supports up to ${moboMaxSpeed}MHz, covering this kit's ${ramSpeed}MHz rating.`
      : `${ram.name} is rated for ${ramSpeed}MHz, above the ${moboMaxSpeed}MHz ${mobo.name} officially supports. It will still work, just running at the board's maximum supported speed instead of its full rated speed.`,
    componentsInvolved: ["RAM", "MOTHERBOARD"],
  };
}
