import type { Build, RuleResult } from "../types";

export function checkCpuSocketMotherboard(build: Build): RuleResult | null {
  const cpu = build.CPU?.product;
  const mobo = build.MOTHERBOARD?.product;
  if (!cpu || !mobo) return null;

  const cpuSocket = cpu.compatibility?.socketType;
  const moboSocket = mobo.compatibility?.socketType;
  if (!cpuSocket || !moboSocket) return null;

  const passed = cpuSocket === moboSocket;
  return {
    rule: "cpu-socket-motherboard",
    severity: "ERROR",
    passed,
    message: passed
      ? `${cpu.name} (${cpuSocket}) matches the socket on ${mobo.name}.`
      : `${cpu.name} uses socket ${cpuSocket}, but ${mobo.name} only supports ${moboSocket}. This CPU will not physically fit this motherboard.`,
    componentsInvolved: ["CPU", "MOTHERBOARD"],
  };
}
