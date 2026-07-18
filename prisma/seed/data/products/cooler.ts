import type { BaseEntry } from "./types";

export type CpuSocketName = "AM4" | "AM5" | "LGA1200" | "LGA1700" | "LGA1851";

export interface CoolerEntry extends BaseEntry {
  coolerType: "AIR" | "AIO";
  radiatorSizeMm: number | null;
  fanCount: number;
  heatpipes: number | null;
  supportedSockets: CpuSocketName[];
  tdpRatingWatts: number;
}

export const coolers: CoolerEntry[] = [
  { name: "Hyper 212 Black Edition", brand: "Cooler Master", coolerType: "AIR", radiatorSizeMm: null, fanCount: 1, heatpipes: 4, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 150, tier: "budget", price: 35, releaseYear: 2020 },
  { name: "NH-U12S Redux", brand: "Noctua", coolerType: "AIR", radiatorSizeMm: null, fanCount: 1, heatpipes: 4, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 150, tier: "budget", price: 50, releaseYear: 2021 },
  { name: "Pure Rock 2", brand: "be quiet!", coolerType: "AIR", radiatorSizeMm: null, fanCount: 1, heatpipes: 3, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 150, tier: "budget", price: 40, releaseYear: 2021 },
  { name: "Hyper 212 EVO V2", brand: "Cooler Master", coolerType: "AIR", radiatorSizeMm: null, fanCount: 1, heatpipes: 4, supportedSockets: ["AM4", "LGA1200", "LGA1700"], tdpRatingWatts: 150, tier: "budget", price: 45, releaseYear: 2021 },
  { name: "NH-U9S", brand: "Noctua", coolerType: "AIR", radiatorSizeMm: null, fanCount: 1, heatpipes: 4, supportedSockets: ["AM4", "LGA1200", "LGA1700"], tdpRatingWatts: 130, tier: "mid", price: 70, releaseYear: 2020 },
  { name: "Freezer 34 eSports DUO", brand: "Arctic", coolerType: "AIR", radiatorSizeMm: null, fanCount: 2, heatpipes: 4, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 180, tier: "mid", price: 50, releaseYear: 2020 },
  { name: "Dark Rock Pro 4", brand: "be quiet!", coolerType: "AIR", radiatorSizeMm: null, fanCount: 2, heatpipes: 7, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 250, tier: "high", price: 90, releaseYear: 2019 },
  { name: "NH-D15", brand: "Noctua", coolerType: "AIR", radiatorSizeMm: null, fanCount: 2, heatpipes: 6, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700", "LGA1851"], tdpRatingWatts: 220, tier: "high", price: 110, releaseYear: 2020 },
  { name: "MasterLiquid ML240L", brand: "Cooler Master", coolerType: "AIO", radiatorSizeMm: 240, fanCount: 2, heatpipes: null, supportedSockets: ["AM4", "LGA1200", "LGA1700"], tdpRatingWatts: 220, tier: "budget", price: 70, releaseYear: 2019 },
  { name: "iCUE H100i Elite Capellix", brand: "Corsair", coolerType: "AIO", radiatorSizeMm: 240, fanCount: 2, heatpipes: null, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 250, tier: "mid", price: 130, releaseYear: 2021 },
  { name: "Liquid Freezer II 280", brand: "Arctic", coolerType: "AIO", radiatorSizeMm: 280, fanCount: 2, heatpipes: null, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 280, tier: "mid", price: 110, releaseYear: 2020 },
  { name: "Kraken X63", brand: "NZXT", coolerType: "AIO", radiatorSizeMm: 280, fanCount: 2, heatpipes: null, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 280, tier: "high", price: 150, releaseYear: 2020 },
  { name: "iCUE H150i Elite Capellix", brand: "Corsair", coolerType: "AIO", radiatorSizeMm: 360, fanCount: 3, heatpipes: null, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700", "LGA1851"], tdpRatingWatts: 300, tier: "high", price: 180, releaseYear: 2021 },
  { name: "Silent Loop 2 360mm", brand: "be quiet!", coolerType: "AIO", radiatorSizeMm: 360, fanCount: 3, heatpipes: null, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 300, tier: "high", price: 190, releaseYear: 2021 },
  { name: "Kraken Z73", brand: "NZXT", coolerType: "AIO", radiatorSizeMm: 360, fanCount: 3, heatpipes: null, supportedSockets: ["AM4", "AM5", "LGA1200", "LGA1700"], tdpRatingWatts: 300, tier: "enthusiast", price: 280, releaseYear: 2020 },
  { name: "iCUE H170i Elite LCD XT", brand: "Corsair", coolerType: "AIO", radiatorSizeMm: 420, fanCount: 3, heatpipes: null, supportedSockets: ["AM4", "AM5", "LGA1700", "LGA1851"], tdpRatingWatts: 320, tier: "enthusiast", price: 280, releaseYear: 2023 },
];
