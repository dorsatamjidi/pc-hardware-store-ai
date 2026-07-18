import type { Build, RuleResult } from "../types";

/** Rough allowance for motherboard, storage, fans, and RAM draw not tracked individually. */
const BASELINE_OTHER_WATTS = 100;
/** Standard PSU-sizing guidance: keep sustained draw under ~80% of rated capacity. */
const RECOMMENDED_HEADROOM_MULTIPLIER = 1.2;

export function checkPsuWattageHeadroom(build: Build): RuleResult | null {
  const psu = build.PSU?.product;
  const cpu = build.CPU?.product;
  const gpu = build.GPU?.product;
  if (!psu || (!cpu && !gpu)) return null;

  const psuCapacity = psu.compatibility?.wattageCapacity;
  if (!psuCapacity) return null;

  const cpuDraw = cpu?.compatibility?.tdpWatts ?? 0;
  const gpuDraw = gpu?.compatibility?.powerDrawWatts ?? 0;
  const estimatedDraw = cpuDraw + gpuDraw + BASELINE_OTHER_WATTS;
  const recommendedCapacity = Math.ceil(estimatedDraw * RECOMMENDED_HEADROOM_MULTIPLIER);

  if (psuCapacity < estimatedDraw) {
    return {
      rule: "psu-wattage-headroom",
      severity: "ERROR",
      passed: false,
      message: `Estimated system draw is ~${estimatedDraw}W, but ${psu.name} only supplies ${psuCapacity}W. This is undersized and may fail to power the system.`,
      componentsInvolved: ["PSU", "CPU", "GPU"],
    };
  }

  const passed = psuCapacity >= recommendedCapacity;
  return {
    rule: "psu-wattage-headroom",
    severity: "WARNING",
    passed,
    message: passed
      ? `${psu.name} (${psuCapacity}W) comfortably covers the estimated ~${estimatedDraw}W system draw.`
      : `${psu.name} (${psuCapacity}W) covers the estimated ~${estimatedDraw}W draw, but with less than the recommended 20% headroom (~${recommendedCapacity}W suggested). It will likely work but leaves little margin.`,
    componentsInvolved: ["PSU", "CPU", "GPU"],
  };
}
