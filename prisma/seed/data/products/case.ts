import type { BaseEntry } from "./types";

export interface CaseEntry extends BaseEntry {
  supportedFormFactors: Array<"E_ATX" | "ATX" | "MICRO_ATX" | "MINI_ITX">;
  includedFans: number;
  sidePanel: "Tempered Glass" | "Mesh" | "Solid";
  driveBays: number;
  maxGpuLengthMm: number;
  maxCoolerHeightMm: number;
}

export const cases: CaseEntry[] = [
  { name: "MasterBox Q300L", brand: "Cooler Master", supportedFormFactors: ["MICRO_ATX", "MINI_ITX"], includedFans: 1, sidePanel: "Mesh", driveBays: 2, maxGpuLengthMm: 360, maxCoolerHeightMm: 158, tier: "budget", price: 50, releaseYear: 2018 },
  { name: "H510", brand: "NZXT", supportedFormFactors: ["ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 2, sidePanel: "Tempered Glass", driveBays: 2, maxGpuLengthMm: 381, maxCoolerHeightMm: 165, tier: "budget", price: 70, releaseYear: 2020 },
  { name: "4000D Airflow", brand: "Corsair", supportedFormFactors: ["ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 2, sidePanel: "Mesh", driveBays: 2, maxGpuLengthMm: 360, maxCoolerHeightMm: 170, tier: "mid", price: 105, releaseYear: 2021 },
  { name: "Meshify 2", brand: "Fractal Design", supportedFormFactors: ["E_ATX", "ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 3, sidePanel: "Mesh", driveBays: 6, maxGpuLengthMm: 460, maxCoolerHeightMm: 185, tier: "mid", price: 140, releaseYear: 2021 },
  { name: "Lancool 215", brand: "Lian Li", supportedFormFactors: ["ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 3, sidePanel: "Mesh", driveBays: 2, maxGpuLengthMm: 384, maxCoolerHeightMm: 176, tier: "mid", price: 95, releaseYear: 2021 },
  { name: "H7 Flow", brand: "NZXT", supportedFormFactors: ["ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 2, sidePanel: "Tempered Glass", driveBays: 2, maxGpuLengthMm: 400, maxCoolerHeightMm: 165, tier: "mid", price: 130, releaseYear: 2022 },
  { name: "North", brand: "Fractal Design", supportedFormFactors: ["ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 2, sidePanel: "Mesh", driveBays: 2, maxGpuLengthMm: 355, maxCoolerHeightMm: 170, tier: "mid", price: 130, releaseYear: 2023 },
  { name: "iCUE 4000X RGB", brand: "Corsair", supportedFormFactors: ["ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 3, sidePanel: "Tempered Glass", driveBays: 2, maxGpuLengthMm: 360, maxCoolerHeightMm: 170, tier: "mid", price: 130, releaseYear: 2020 },
  { name: "NR200P", brand: "Cooler Master", supportedFormFactors: ["MINI_ITX"], includedFans: 2, sidePanel: "Mesh", driveBays: 2, maxGpuLengthMm: 330, maxCoolerHeightMm: 155, tier: "mid", price: 100, releaseYear: 2020 },
  { name: "5000D Airflow", brand: "Corsair", supportedFormFactors: ["E_ATX", "ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 2, sidePanel: "Mesh", driveBays: 3, maxGpuLengthMm: 420, maxCoolerHeightMm: 170, tier: "high", price: 175, releaseYear: 2021 },
  { name: "O11 Dynamic", brand: "Lian Li", supportedFormFactors: ["E_ATX", "ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 0, sidePanel: "Tempered Glass", driveBays: 2, maxGpuLengthMm: 420, maxCoolerHeightMm: 155, tier: "high", price: 150, releaseYear: 2019 },
  { name: "Terra", brand: "Fractal Design", supportedFormFactors: ["MINI_ITX"], includedFans: 0, sidePanel: "Solid", driveBays: 2, maxGpuLengthMm: 314, maxCoolerHeightMm: 72, tier: "high", price: 210, releaseYear: 2023 },
  { name: "Lancool III", brand: "Lian Li", supportedFormFactors: ["E_ATX", "ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 3, sidePanel: "Mesh", driveBays: 4, maxGpuLengthMm: 422, maxCoolerHeightMm: 187, tier: "high", price: 170, releaseYear: 2023 },
  { name: "HAF 700", brand: "Cooler Master", supportedFormFactors: ["E_ATX", "ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 3, sidePanel: "Mesh", driveBays: 4, maxGpuLengthMm: 490, maxCoolerHeightMm: 198, tier: "enthusiast", price: 350, releaseYear: 2022 },
  { name: "7000D Airflow", brand: "Corsair", supportedFormFactors: ["E_ATX", "ATX", "MICRO_ATX", "MINI_ITX"], includedFans: 3, sidePanel: "Mesh", driveBays: 4, maxGpuLengthMm: 470, maxCoolerHeightMm: 190, tier: "enthusiast", price: 270, releaseYear: 2021 },
  { name: "H1 V2", brand: "NZXT", supportedFormFactors: ["MINI_ITX"], includedFans: 1, sidePanel: "Tempered Glass", driveBays: 1, maxGpuLengthMm: 325, maxCoolerHeightMm: 60, tier: "mid", price: 210, releaseYear: 2022 },
];
