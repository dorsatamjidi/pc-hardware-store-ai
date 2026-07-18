import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface RuleResultDto {
  rule: string;
  severity: "ERROR" | "WARNING" | "INFO";
  passed: boolean;
  message: string;
  componentsInvolved: string[];
}

export interface CompatibilityReportDto {
  status: "COMPATIBLE" | "COMPATIBLE_WITH_WARNINGS" | "INCOMPATIBLE";
  results: RuleResultDto[];
  estimatedWattage: number | null;
  totalPrice: number;
}

const STATUS_CONFIG = {
  COMPATIBLE: { label: "Compatible", variant: "outline" as const, className: "border-green-600/40 text-green-700 dark:text-green-400" },
  COMPATIBLE_WITH_WARNINGS: { label: "Compatible, with warnings", variant: "secondary" as const, className: "" },
  INCOMPATIBLE: { label: "Incompatible", variant: "destructive" as const, className: "" },
};

export function CompatibilityReportView({
  report,
  explanation,
}: {
  report: CompatibilityReportDto;
  explanation?: string | null;
}) {
  const config = STATUS_CONFIG[report.status];
  const issues = report.results.filter((r) => !r.passed);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4">
      <div className="flex items-center gap-2">
        <Badge variant={config.variant} className={config.className}>
          {config.label}
        </Badge>
        {report.estimatedWattage ? (
          <span className="text-xs text-muted-foreground">~{report.estimatedWattage}W estimated draw</span>
        ) : null}
      </div>

      {explanation ? <p className="text-sm text-muted-foreground">{explanation}</p> : null}

      {issues.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {issues.map((r) => (
            <li
              key={r.rule}
              className={cn(
                "text-xs",
                r.severity === "ERROR" ? "text-destructive" : "text-amber-600 dark:text-amber-500",
              )}
            >
              <span className="font-medium">{r.severity === "ERROR" ? "Error: " : "Warning: "}</span>
              {r.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
