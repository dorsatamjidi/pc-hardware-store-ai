import type { BaseEntry } from "./types";

export interface MouseEntry extends BaseEntry {
  dpi: number;
  buttons: number;
  wireless: boolean;
  weightG: number;
}

export const mice: MouseEntry[] = [
  { name: "M100", brand: "Logitech", dpi: 1000, buttons: 3, wireless: false, weightG: 105, tier: "budget", price: 10, releaseYear: 2018 },
  { name: "G203", brand: "Logitech", dpi: 8000, buttons: 6, wireless: false, weightG: 85, tier: "budget", price: 30, releaseYear: 2019 },
  { name: "DeathAdder Essential", brand: "Razer", dpi: 6400, buttons: 5, wireless: false, weightG: 96, tier: "budget", price: 30, releaseYear: 2019 },
  { name: "Rival 3", brand: "SteelSeries", dpi: 8500, buttons: 6, wireless: false, weightG: 77, tier: "budget", price: 30, releaseYear: 2020 },
  { name: "Harpoon RGB", brand: "Corsair", dpi: 6000, buttons: 6, wireless: false, weightG: 85, tier: "budget", price: 25, releaseYear: 2019 },
  { name: "G502 HERO", brand: "Logitech", dpi: 25600, buttons: 11, wireless: false, weightG: 121, tier: "mid", price: 60, releaseYear: 2018 },
  { name: "Basilisk V3", brand: "Razer", dpi: 26000, buttons: 11, wireless: false, weightG: 101, tier: "mid", price: 70, releaseYear: 2021 },
  { name: "Rival 650 Wireless", brand: "SteelSeries", dpi: 12000, buttons: 7, wireless: true, weightG: 121, tier: "high", price: 100, releaseYear: 2019 },
  { name: "Viper Ultimate", brand: "Razer", dpi: 20000, buttons: 8, wireless: true, weightG: 74, tier: "high", price: 130, releaseYear: 2019 },
  { name: "G Pro X Superlight", brand: "Logitech", dpi: 25600, buttons: 5, wireless: true, weightG: 63, tier: "high", price: 150, releaseYear: 2020 },
  { name: "G502 X PLUS", brand: "Logitech", dpi: 25600, buttons: 13, wireless: true, weightG: 106, tier: "enthusiast", price: 160, releaseYear: 2022 },
  { name: "DeathAdder V3 Pro", brand: "Razer", dpi: 30000, buttons: 5, wireless: true, weightG: 63, tier: "enthusiast", price: 150, releaseYear: 2023 },
];
