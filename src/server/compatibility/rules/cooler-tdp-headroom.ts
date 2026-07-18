import type { Build, RuleResult } from "../types";

export function checkCoolerTdpHeadroom(build: Build): RuleResult | null {
  const cpu = build.CPU?.product;
  const cooler = build.COOLER?.product;
  if (!cpu || !cooler) return null;

  const cpuTdp = cpu.compatibility?.tdpWatts;
  const coolerRating = cooler.compatibility?.tdpWatts;
  if (!cpuTdp || !coolerRating) return null;

  const passed = cpuTdp <= coolerRating;
  return {
    rule: "cooler-tdp-headroom",
    severity: "WARNING",
    passed,
    message: passed
      ? `${cooler.name} is rated for ${coolerRating}W, comfortably covering the ${cpuTdp}W ${cpu.name}.`
      : `${cpu.name} has a ${cpuTdp}W thermal envelope, above the ${coolerRating}W ${cooler.name} is rated to dissipate. It may run hot or thermal-throttle under sustained load.`,
    componentsInvolved: ["COOLER", "CPU"],
  };
}
