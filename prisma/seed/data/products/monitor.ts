import type { BaseEntry } from "./types";

export interface MonitorEntry extends BaseEntry {
  sizeInches: number;
  resolution: string;
  refreshRateHz: number;
  panelType: string;
  responseTimeMs: number;
}

export const monitors: MonitorEntry[] = [
  { name: "SB220Q", brand: "Acer", sizeInches: 21.5, resolution: "1920x1080", refreshRateHz: 75, panelType: "IPS", responseTimeMs: 4, tier: "budget", price: 90, releaseYear: 2020 },
  { name: "S2421HS", brand: "Dell", sizeInches: 24, resolution: "1920x1080", refreshRateHz: 75, panelType: "IPS", responseTimeMs: 4, tier: "budget", price: 130, releaseYear: 2021 },
  { name: "24GQ50F", brand: "LG", sizeInches: 24, resolution: "1920x1080", refreshRateHz: 165, panelType: "VA", responseTimeMs: 1, tier: "budget", price: 150, releaseYear: 2022 },
  { name: "TUF Gaming VG249Q", brand: "ASUS", sizeInches: 24, resolution: "1920x1080", refreshRateHz: 144, panelType: "IPS", responseTimeMs: 1, tier: "mid", price: 160, releaseYear: 2020 },
  { name: "Nitro XV272U", brand: "Acer", sizeInches: 27, resolution: "2560x1440", refreshRateHz: 170, panelType: "IPS", responseTimeMs: 1, tier: "mid", price: 280, releaseYear: 2022 },
  { name: "27GP850-B", brand: "LG", sizeInches: 27, resolution: "2560x1440", refreshRateHz: 165, panelType: "Nano IPS", responseTimeMs: 1, tier: "mid", price: 300, releaseYear: 2021 },
  { name: "S2722DGM", brand: "Dell", sizeInches: 27, resolution: "2560x1440", refreshRateHz: 165, panelType: "VA", responseTimeMs: 1, tier: "mid", price: 250, releaseYear: 2022 },
  { name: "27UP850", brand: "LG", sizeInches: 27, resolution: "3840x2160", refreshRateHz: 60, panelType: "IPS", responseTimeMs: 5, tier: "mid", price: 330, releaseYear: 2020 },
  { name: "Predator XB273U", brand: "Acer", sizeInches: 27, resolution: "2560x1440", refreshRateHz: 170, panelType: "IPS", responseTimeMs: 1, tier: "mid", price: 350, releaseYear: 2021 },
  { name: "ROG Swift PG279QM", brand: "ASUS", sizeInches: 27, resolution: "2560x1440", refreshRateHz: 240, panelType: "IPS", responseTimeMs: 1, tier: "high", price: 600, releaseYear: 2020 },
  { name: "Odyssey G7", brand: "Samsung", sizeInches: 32, resolution: "2560x1440", refreshRateHz: 240, panelType: "VA", responseTimeMs: 1, tier: "high", price: 650, releaseYear: 2021 },
  { name: "27GR95QE-B", brand: "LG", sizeInches: 27, resolution: "2560x1440", refreshRateHz: 240, panelType: "OLED", responseTimeMs: 0.03, tier: "enthusiast", price: 800, releaseYear: 2023 },
  { name: "ROG Swift PG32UQX", brand: "ASUS", sizeInches: 32, resolution: "3840x2160", refreshRateHz: 144, panelType: "IPS", responseTimeMs: 4, tier: "enthusiast", price: 1800, releaseYear: 2021 },
  { name: "Odyssey Neo G9", brand: "Samsung", sizeInches: 49, resolution: "5120x1440", refreshRateHz: 240, panelType: "VA", responseTimeMs: 1, tier: "enthusiast", price: 1400, releaseYear: 2022 },
];
