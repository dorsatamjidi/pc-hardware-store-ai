import type { Build, CompatibilityReport, CompatibilityRule } from "./types";
import { checkCpuSocketMotherboard } from "./rules/cpu-socket-motherboard";
import { checkRamTypeMotherboard } from "./rules/ram-type-motherboard";
import { checkRamSpeedSupport } from "./rules/ram-speed-support";
import { checkRamCapacityVsMax } from "./rules/ram-capacity-vs-max";
import { checkRamModuleCountVsSlots } from "./rules/ram-module-count-vs-slots";
import { checkCaseMotherboardFormFactor } from "./rules/case-motherboard-form-factor";
import { checkGpuCaseClearance } from "./rules/gpu-case-clearance";
import { checkCoolerCpuSocketSupport } from "./rules/cooler-cpu-socket-support";
import { checkCoolerTdpHeadroom } from "./rules/cooler-tdp-headroom";
import { checkPsuWattageHeadroom } from "./rules/psu-wattage-headroom";
import { checkStorageInterfaceAvailability } from "./rules/storage-interface-availability";

const RULES: CompatibilityRule[] = [
  checkCpuSocketMotherboard,
  checkRamTypeMotherboard,
  checkRamSpeedSupport,
  checkRamCapacityVsMax,
  checkRamModuleCountVsSlots,
  checkCaseMotherboardFormFactor,
  checkGpuCaseClearance,
  checkCoolerCpuSocketSupport,
  checkCoolerTdpHeadroom,
  checkPsuWattageHeadroom,
  checkStorageInterfaceAvailability,
];

function estimateWattage(build: Build): number | null {
  const cpu = build.CPU?.product.compatibility?.tdpWatts ?? 0;
  const gpu = build.GPU?.product.compatibility?.powerDrawWatts ?? 0;
  if (!cpu && !gpu) return null;
  return cpu + gpu + 100;
}

function estimateTotalPrice(build: Build): number {
  return Object.values(build).reduce((sum, component) => {
    if (!component) return sum;
    return sum + Number(component.product.price) * component.quantity;
  }, 0);
}

/**
 * Runs every rule applicable to the components currently present (rules
 * return `null` and are skipped when a required slot is empty), so partial
 * builds are supported. Never LLM-decided — the chat model only narrates
 * this output in `src/server/ai/prompts/compat-explain.ts`.
 */
export function runCompatibilityEngine(build: Build): CompatibilityReport {
  const results = RULES.map((rule) => rule(build)).filter((r) => r !== null);

  const hasError = results.some((r) => !r.passed && r.severity === "ERROR");
  const hasWarning = results.some((r) => !r.passed && r.severity === "WARNING");

  const status = hasError ? "INCOMPATIBLE" : hasWarning ? "COMPATIBLE_WITH_WARNINGS" : "COMPATIBLE";

  return {
    status,
    results,
    estimatedWattage: estimateWattage(build),
    totalPrice: Math.round(estimateTotalPrice(build) * 100) / 100,
  };
}
