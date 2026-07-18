import type { Build, RuleResult } from "../types";

export function checkCoolerCpuSocketSupport(build: Build): RuleResult | null {
  const cpu = build.CPU?.product;
  const cooler = build.COOLER?.product;
  if (!cpu || !cooler) return null;

  const cpuSocket = cpu.compatibility?.socketType;
  const supportedSockets = cooler.compatibility?.coolerSupportedSockets;
  if (!cpuSocket || !supportedSockets || supportedSockets.length === 0) return null;

  const passed = supportedSockets.includes(cpuSocket);
  return {
    rule: "cooler-cpu-socket-support",
    severity: "ERROR",
    passed,
    message: passed
      ? `${cooler.name} includes a mounting bracket for ${cpuSocket}.`
      : `${cooler.name} supports sockets ${supportedSockets.join(", ")}, but ${cpu.name} uses ${cpuSocket}. There is no mounting bracket for this combination.`,
    componentsInvolved: ["COOLER", "CPU"],
  };
}
