import type { ComponentSlot } from "@/server/compatibility/types";

export type UseCase = "gaming" | "office" | "ai_workstation" | "video_editing" | "programming" | "home_server";

export const USE_CASES: UseCase[] = [
  "gaming",
  "office",
  "ai_workstation",
  "video_editing",
  "programming",
  "home_server",
];

/** Percent of total budget allocated per component slot, by use case. Each row sums to 1.0. */
const ALLOCATION_TABLE: Record<UseCase, Record<ComponentSlot, number>> = {
  gaming: { CPU: 0.2, GPU: 0.35, MOTHERBOARD: 0.1, RAM: 0.1, STORAGE: 0.1, PSU: 0.08, CASE: 0.05, COOLER: 0.02 },
  office: { CPU: 0.3, GPU: 0.05, MOTHERBOARD: 0.15, RAM: 0.15, STORAGE: 0.15, PSU: 0.1, CASE: 0.08, COOLER: 0.02 },
  ai_workstation: { CPU: 0.2, GPU: 0.4, MOTHERBOARD: 0.1, RAM: 0.15, STORAGE: 0.08, PSU: 0.05, CASE: 0.01, COOLER: 0.01 },
  video_editing: { CPU: 0.28, GPU: 0.25, MOTHERBOARD: 0.1, RAM: 0.18, STORAGE: 0.1, PSU: 0.06, CASE: 0.02, COOLER: 0.01 },
  programming: { CPU: 0.3, GPU: 0.1, MOTHERBOARD: 0.12, RAM: 0.2, STORAGE: 0.15, PSU: 0.08, CASE: 0.03, COOLER: 0.02 },
  home_server: { CPU: 0.15, GPU: 0, MOTHERBOARD: 0.15, RAM: 0.15, STORAGE: 0.35, PSU: 0.1, CASE: 0.08, COOLER: 0.02 },
};

export const USE_CASE_LABELS: Record<UseCase, string> = {
  gaming: "Gaming PC",
  office: "Office PC",
  ai_workstation: "AI Workstation",
  video_editing: "Video Editing",
  programming: "Programming",
  home_server: "Home Server",
};

/** Pure function: budget in USD -> per-slot dollar allocation. Slots allocated 0 are omitted (e.g. no GPU for home servers). */
export function allocateBudget(useCase: UseCase, budget: number): Partial<Record<ComponentSlot, number>> {
  const table = ALLOCATION_TABLE[useCase];
  const allocation: Partial<Record<ComponentSlot, number>> = {};

  for (const [slot, percent] of Object.entries(table) as [ComponentSlot, number][]) {
    if (percent <= 0) continue;
    allocation[slot] = Math.round(budget * percent * 100) / 100;
  }

  return allocation;
}
