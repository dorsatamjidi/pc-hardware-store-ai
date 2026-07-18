import type { BaseEntry } from "./types";

export interface FanEntry extends BaseEntry {
  sizeMm: number;
  rgb: boolean;
  airflowCfm: number;
  noiseLevelDb: number;
}

export const fans: FanEntry[] = [
  { name: "NF-P12 redux-1700", brand: "Noctua", sizeMm: 120, rgb: false, airflowCfm: 54.6, noiseLevelDb: 18.1, tier: "budget", price: 13, releaseYear: 2018 },
  { name: "P12 PWM", brand: "Arctic", sizeMm: 120, rgb: false, airflowCfm: 56.3, noiseLevelDb: 22.5, tier: "budget", price: 8, releaseYear: 2020 },
  { name: "ST120 ARGB", brand: "Lian Li", sizeMm: 120, rgb: true, airflowCfm: 58.24, noiseLevelDb: 26.9, tier: "budget", price: 16, releaseYear: 2022 },
  { name: "P14 PWM PST", brand: "Arctic", sizeMm: 140, rgb: false, airflowCfm: 72.8, noiseLevelDb: 22.4, tier: "budget", price: 10, releaseYear: 2020 },
  { name: "LL120 RGB", brand: "Corsair", sizeMm: 120, rgb: true, airflowCfm: 43.25, noiseLevelDb: 24.9, tier: "mid", price: 25, releaseYear: 2019 },
  { name: "MasterFan MF120 Halo", brand: "Cooler Master", sizeMm: 120, rgb: true, airflowCfm: 62, noiseLevelDb: 27, tier: "mid", price: 18, releaseYear: 2021 },
  { name: "Aer RGB 2 120mm", brand: "NZXT", sizeMm: 120, rgb: true, airflowCfm: 45.75, noiseLevelDb: 21, tier: "mid", price: 20, releaseYear: 2020 },
  { name: "LL140 RGB", brand: "Corsair", sizeMm: 140, rgb: true, airflowCfm: 62.7, noiseLevelDb: 26, tier: "mid", price: 30, releaseYear: 2019 },
  { name: "NF-A12x25", brand: "Noctua", sizeMm: 120, rgb: false, airflowCfm: 60.1, noiseLevelDb: 22.6, tier: "high", price: 33, releaseYear: 2018 },
  { name: "Silent Wings 4 140mm", brand: "be quiet!", sizeMm: 140, rgb: false, airflowCfm: 79.94, noiseLevelDb: 23.6, tier: "high", price: 25, releaseYear: 2022 },
];
