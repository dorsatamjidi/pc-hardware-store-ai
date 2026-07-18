import type { CompatibilityReport } from "@/server/compatibility/types";

/**
 * Strips passing rules before handing a report to the LLM. Passing rules
 * still carry their rule `severity` (ERROR/WARNING) even when `passed` is
 * true, and models reliably latch onto that label instead of checking
 * `passed` — producing hallucinated "warnings" for rules that actually
 * passed. Only real problems (`passed: false`) are issues; there is nothing
 * else to misread once they're the only things in the payload.
 */
export function summarizeReportForLlm(report: CompatibilityReport) {
  return {
    status: report.status,
    issues: report.results
      .filter((r) => !r.passed)
      .map((r) => ({ severity: r.severity, message: r.message })),
    estimatedWattage: report.estimatedWattage,
    totalPrice: report.totalPrice,
  };
}
