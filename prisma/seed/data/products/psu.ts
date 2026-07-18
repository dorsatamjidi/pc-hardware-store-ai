import type { BaseEntry } from "./types";

export interface PsuEntry extends BaseEntry {
  wattage: number;
  efficiency: "WHITE" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "TITANIUM";
  modular: "Full" | "Semi" | "None";
  fanSizeMm: number;
}

export const psus: PsuEntry[] = [
  { name: "CV450", brand: "Corsair", wattage: 450, efficiency: "BRONZE", modular: "None", fanSizeMm: 120, tier: "budget", price: 45, releaseYear: 2020 },
  { name: "500 BR", brand: "EVGA", wattage: 500, efficiency: "BRONZE", modular: "None", fanSizeMm: 120, tier: "budget", price: 50, releaseYear: 2020 },
  { name: "CX550", brand: "Corsair", wattage: 550, efficiency: "BRONZE", modular: "Semi", fanSizeMm: 120, tier: "budget", price: 60, releaseYear: 2021 },
  { name: "Core GM-650", brand: "Seasonic", wattage: 650, efficiency: "GOLD", modular: "Semi", fanSizeMm: 120, tier: "mid", price: 80, releaseYear: 2021 },
  { name: "RM650", brand: "Corsair", wattage: 650, efficiency: "GOLD", modular: "Full", fanSizeMm: 135, tier: "mid", price: 95, releaseYear: 2022 },
  { name: "SuperNOVA 750 GT", brand: "EVGA", wattage: 750, efficiency: "GOLD", modular: "Full", fanSizeMm: 135, tier: "mid", price: 100, releaseYear: 2021 },
  { name: "Straight Power 11 750W", brand: "be quiet!", wattage: 750, efficiency: "PLATINUM", modular: "Full", fanSizeMm: 135, tier: "high", price: 140, releaseYear: 2020 },
  { name: "RM750x", brand: "Corsair", wattage: 750, efficiency: "GOLD", modular: "Full", fanSizeMm: 135, tier: "high", price: 120, releaseYear: 2022 },
  { name: "MWE Gold 850", brand: "Cooler Master", wattage: 850, efficiency: "GOLD", modular: "Full", fanSizeMm: 135, tier: "high", price: 130, releaseYear: 2021 },
  { name: "FOCUS GX-850", brand: "Seasonic", wattage: 850, efficiency: "GOLD", modular: "Full", fanSizeMm: 120, tier: "high", price: 135, releaseYear: 2021 },
  { name: "RM1000x", brand: "Corsair", wattage: 1000, efficiency: "GOLD", modular: "Full", fanSizeMm: 135, tier: "enthusiast", price: 180, releaseYear: 2022 },
  { name: "SuperNOVA 1000 P2", brand: "EVGA", wattage: 1000, efficiency: "PLATINUM", modular: "Full", fanSizeMm: 140, tier: "enthusiast", price: 210, releaseYear: 2020 },
  { name: "PRIME TX-1000", brand: "Seasonic", wattage: 1000, efficiency: "TITANIUM", modular: "Full", fanSizeMm: 135, tier: "enthusiast", price: 280, releaseYear: 2021 },
  { name: "Dark Power 13 1000W", brand: "be quiet!", wattage: 1000, efficiency: "TITANIUM", modular: "Full", fanSizeMm: 135, tier: "enthusiast", price: 290, releaseYear: 2023 },
  { name: "HX1200", brand: "Corsair", wattage: 1200, efficiency: "PLATINUM", modular: "Full", fanSizeMm: 140, tier: "enthusiast", price: 320, releaseYear: 2021 },
  { name: "V1300 Platinum", brand: "Cooler Master", wattage: 1300, efficiency: "PLATINUM", modular: "Full", fanSizeMm: 140, tier: "enthusiast", price: 350, releaseYear: 2022 },
];
