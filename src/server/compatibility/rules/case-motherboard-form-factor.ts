import type { Build, RuleResult } from "../types";

export function checkCaseMotherboardFormFactor(build: Build): RuleResult | null {
  const mobo = build.MOTHERBOARD?.product;
  const pcCase = build.CASE?.product;
  if (!mobo || !pcCase) return null;

  const moboFormFactor = mobo.compatibility?.formFactor;
  const supportedFormFactors = pcCase.compatibility?.caseSupportedFormFactors;
  if (!moboFormFactor || !supportedFormFactors || supportedFormFactors.length === 0) return null;

  const passed = supportedFormFactors.includes(moboFormFactor);
  return {
    rule: "case-motherboard-form-factor",
    severity: "ERROR",
    passed,
    message: passed
      ? `${pcCase.name} supports ${moboFormFactor.replace("_", "-")} motherboards like ${mobo.name}.`
      : `${mobo.name} is ${moboFormFactor.replace("_", "-")}, but ${pcCase.name} only supports ${supportedFormFactors.map((f) => f.replace("_", "-")).join(", ")}. It will not fit.`,
    componentsInvolved: ["MOTHERBOARD", "CASE"],
  };
}
