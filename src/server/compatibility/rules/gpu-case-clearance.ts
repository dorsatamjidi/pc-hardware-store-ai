import type { Build, RuleResult } from "../types";

export function checkGpuCaseClearance(build: Build): RuleResult | null {
  const gpu = build.GPU?.product;
  const pcCase = build.CASE?.product;
  if (!gpu || !pcCase) return null;

  const gpuLength = gpu.compatibility?.gpuLengthMm;
  const maxLength = pcCase.compatibility?.caseMaxGpuLengthMm;
  if (!gpuLength || !maxLength) return null;

  const passed = gpuLength <= maxLength;
  return {
    rule: "gpu-case-clearance",
    severity: "ERROR",
    passed,
    message: passed
      ? `${gpu.name} (${gpuLength}mm) fits within the ${maxLength}mm GPU clearance of ${pcCase.name}.`
      : `${gpu.name} is ${gpuLength}mm long, longer than the ${maxLength}mm of GPU clearance in ${pcCase.name}. It will not fit.`,
    componentsInvolved: ["GPU", "CASE"],
  };
}
