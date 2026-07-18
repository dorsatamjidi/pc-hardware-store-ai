import type { BaseEntry } from "./types";

export interface CpuEntry extends BaseEntry {
  socket: "AM4" | "AM5" | "LGA1200" | "LGA1700" | "LGA1851";
  cores: number;
  threads: number;
  baseClockGhz: number;
  boostClockGhz: number;
  cacheMb: number;
  tdpWatts: number;
  architecture: string;
  integratedGraphics: string | null;
  unlocked: boolean;
}

export const cpus: CpuEntry[] = [
  // Intel LGA1200 (10th/11th gen — budget legacy)
  { name: "Core i3-10100", brand: "Intel", socket: "LGA1200", cores: 4, threads: 8, baseClockGhz: 3.6, boostClockGhz: 4.3, cacheMb: 6, tdpWatts: 65, architecture: "Comet Lake", integratedGraphics: "UHD 630", unlocked: false, tier: "budget", price: 95, releaseYear: 2020 },
  { name: "Core i5-11400F", brand: "Intel", socket: "LGA1200", cores: 6, threads: 12, baseClockGhz: 2.6, boostClockGhz: 4.4, cacheMb: 12, tdpWatts: 65, architecture: "Rocket Lake", integratedGraphics: null, unlocked: false, tier: "budget", price: 130, releaseYear: 2021 },
  // Intel LGA1700 (12th/13th/14th gen)
  { name: "Core i3-12100F", brand: "Intel", socket: "LGA1700", cores: 4, threads: 8, baseClockGhz: 3.3, boostClockGhz: 4.3, cacheMb: 12, tdpWatts: 58, architecture: "Alder Lake", integratedGraphics: null, unlocked: false, tier: "budget", price: 110, releaseYear: 2021 },
  { name: "Core i5-12400", brand: "Intel", socket: "LGA1700", cores: 6, threads: 12, baseClockGhz: 2.5, boostClockGhz: 4.4, cacheMb: 18, tdpWatts: 65, architecture: "Alder Lake", integratedGraphics: "UHD 730", unlocked: false, tier: "budget", price: 170, releaseYear: 2021 },
  { name: "Core i5-13400F", brand: "Intel", socket: "LGA1700", cores: 10, threads: 16, baseClockGhz: 2.5, boostClockGhz: 4.6, cacheMb: 20, tdpWatts: 65, architecture: "Raptor Lake", integratedGraphics: null, unlocked: false, tier: "mid", price: 200, releaseYear: 2023 },
  { name: "Core i5-13600K", brand: "Intel", socket: "LGA1700", cores: 14, threads: 20, baseClockGhz: 3.5, boostClockGhz: 5.1, cacheMb: 24, tdpWatts: 125, architecture: "Raptor Lake", integratedGraphics: "UHD 770", unlocked: true, tier: "high", price: 310, releaseYear: 2022 },
  { name: "Core i5-14600K", brand: "Intel", socket: "LGA1700", cores: 14, threads: 20, baseClockGhz: 3.5, boostClockGhz: 5.3, cacheMb: 24, tdpWatts: 125, architecture: "Raptor Lake Refresh", integratedGraphics: "UHD 770", unlocked: true, tier: "high", price: 320, releaseYear: 2023 },
  { name: "Core i7-12700K", brand: "Intel", socket: "LGA1700", cores: 12, threads: 20, baseClockGhz: 3.6, boostClockGhz: 5.0, cacheMb: 25, tdpWatts: 125, architecture: "Alder Lake", integratedGraphics: "UHD 770", unlocked: true, tier: "high", price: 370, releaseYear: 2021 },
  { name: "Core i7-13700K", brand: "Intel", socket: "LGA1700", cores: 16, threads: 24, baseClockGhz: 3.4, boostClockGhz: 5.4, cacheMb: 30, tdpWatts: 125, architecture: "Raptor Lake", integratedGraphics: "UHD 770", unlocked: true, tier: "high", price: 410, releaseYear: 2022 },
  { name: "Core i7-14700K", brand: "Intel", socket: "LGA1700", cores: 20, threads: 28, baseClockGhz: 3.4, boostClockGhz: 5.6, cacheMb: 33, tdpWatts: 125, architecture: "Raptor Lake Refresh", integratedGraphics: "UHD 770", unlocked: true, tier: "enthusiast", price: 420, releaseYear: 2023 },
  { name: "Core i9-13900K", brand: "Intel", socket: "LGA1700", cores: 24, threads: 32, baseClockGhz: 3.0, boostClockGhz: 5.8, cacheMb: 36, tdpWatts: 125, architecture: "Raptor Lake", integratedGraphics: "UHD 770", unlocked: true, tier: "enthusiast", price: 570, releaseYear: 2022 },
  { name: "Core i9-14900K", brand: "Intel", socket: "LGA1700", cores: 24, threads: 32, baseClockGhz: 3.2, boostClockGhz: 6.0, cacheMb: 36, tdpWatts: 125, architecture: "Raptor Lake Refresh", integratedGraphics: "UHD 770", unlocked: true, tier: "enthusiast", price: 580, releaseYear: 2023 },
  { name: "Core i9-14900KS", brand: "Intel", socket: "LGA1700", cores: 24, threads: 32, baseClockGhz: 3.2, boostClockGhz: 6.2, cacheMb: 36, tdpWatts: 150, architecture: "Raptor Lake Refresh", integratedGraphics: "UHD 770", unlocked: true, tier: "enthusiast", price: 700, releaseYear: 2024 },
  // Intel LGA1851 (Core Ultra 200-series)
  { name: "Core Ultra 5 245K", brand: "Intel", socket: "LGA1851", cores: 14, threads: 14, baseClockGhz: 4.2, boostClockGhz: 5.2, cacheMb: 24, tdpWatts: 125, architecture: "Arrow Lake", integratedGraphics: "Xe Graphics", unlocked: true, tier: "high", price: 310, releaseYear: 2024 },
  { name: "Core Ultra 7 265K", brand: "Intel", socket: "LGA1851", cores: 20, threads: 20, baseClockGhz: 3.9, boostClockGhz: 5.5, cacheMb: 30, tdpWatts: 125, architecture: "Arrow Lake", integratedGraphics: "Xe Graphics", unlocked: true, tier: "high", price: 395, releaseYear: 2024 },
  { name: "Core Ultra 9 285K", brand: "Intel", socket: "LGA1851", cores: 24, threads: 24, baseClockGhz: 3.7, boostClockGhz: 5.7, cacheMb: 36, tdpWatts: 125, architecture: "Arrow Lake", integratedGraphics: "Xe Graphics", unlocked: true, tier: "enthusiast", price: 590, releaseYear: 2024 },
  // AMD AM4 (Ryzen 3000/4000/5000)
  { name: "Ryzen 3 4100", brand: "AMD", socket: "AM4", cores: 4, threads: 8, baseClockGhz: 3.8, boostClockGhz: 4.0, cacheMb: 6, tdpWatts: 65, architecture: "Zen 2", integratedGraphics: null, unlocked: false, tier: "budget", price: 90, releaseYear: 2021 },
  { name: "Ryzen 5 5500", brand: "AMD", socket: "AM4", cores: 6, threads: 12, baseClockGhz: 3.6, boostClockGhz: 4.2, cacheMb: 19, tdpWatts: 65, architecture: "Zen 3", integratedGraphics: null, unlocked: false, tier: "budget", price: 110, releaseYear: 2022 },
  { name: "Ryzen 5 5600", brand: "AMD", socket: "AM4", cores: 6, threads: 12, baseClockGhz: 3.5, boostClockGhz: 4.4, cacheMb: 35, tdpWatts: 65, architecture: "Zen 3", integratedGraphics: null, unlocked: true, tier: "mid", price: 140, releaseYear: 2022 },
  { name: "Ryzen 7 5700X", brand: "AMD", socket: "AM4", cores: 8, threads: 16, baseClockGhz: 3.4, boostClockGhz: 4.6, cacheMb: 36, tdpWatts: 65, architecture: "Zen 3", integratedGraphics: null, unlocked: true, tier: "mid", price: 190, releaseYear: 2022 },
  { name: "Ryzen 7 5800X3D", brand: "AMD", socket: "AM4", cores: 8, threads: 16, baseClockGhz: 3.4, boostClockGhz: 4.5, cacheMb: 100, tdpWatts: 105, architecture: "Zen 3", integratedGraphics: null, unlocked: false, tier: "high", price: 320, releaseYear: 2022 },
  { name: "Ryzen 9 5900X", brand: "AMD", socket: "AM4", cores: 12, threads: 24, baseClockGhz: 3.7, boostClockGhz: 4.8, cacheMb: 70, tdpWatts: 105, architecture: "Zen 3", integratedGraphics: null, unlocked: true, tier: "enthusiast", price: 360, releaseYear: 2020 },
  // AMD AM5 (Ryzen 7000/9000)
  { name: "Ryzen 5 7600", brand: "AMD", socket: "AM5", cores: 6, threads: 12, baseClockGhz: 3.8, boostClockGhz: 5.1, cacheMb: 38, tdpWatts: 65, architecture: "Zen 4", integratedGraphics: "Radeon Graphics", unlocked: true, tier: "mid", price: 200, releaseYear: 2023 },
  { name: "Ryzen 7 7700X", brand: "AMD", socket: "AM5", cores: 8, threads: 16, baseClockGhz: 4.5, boostClockGhz: 5.4, cacheMb: 40, tdpWatts: 105, architecture: "Zen 4", integratedGraphics: "Radeon Graphics", unlocked: true, tier: "high", price: 300, releaseYear: 2022 },
  { name: "Ryzen 7 7800X3D", brand: "AMD", socket: "AM5", cores: 8, threads: 16, baseClockGhz: 4.2, boostClockGhz: 5.0, cacheMb: 104, tdpWatts: 120, architecture: "Zen 4", integratedGraphics: "Radeon Graphics", unlocked: false, tier: "high", price: 380, releaseYear: 2023 },
  { name: "Ryzen 9 7950X3D", brand: "AMD", socket: "AM5", cores: 16, threads: 32, baseClockGhz: 4.2, boostClockGhz: 5.7, cacheMb: 144, tdpWatts: 120, architecture: "Zen 4", integratedGraphics: "Radeon Graphics", unlocked: false, tier: "enthusiast", price: 600, releaseYear: 2023 },
  { name: "Ryzen 9 9950X", brand: "AMD", socket: "AM5", cores: 16, threads: 32, baseClockGhz: 4.3, boostClockGhz: 5.7, cacheMb: 80, tdpWatts: 170, architecture: "Zen 5", integratedGraphics: "Radeon Graphics", unlocked: true, tier: "enthusiast", price: 650, releaseYear: 2024 },
];
