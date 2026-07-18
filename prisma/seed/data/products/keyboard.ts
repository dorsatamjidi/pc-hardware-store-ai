import type { BaseEntry } from "./types";

export interface KeyboardEntry extends BaseEntry {
  switchType: string;
  layout: "Full-size" | "TKL" | "60%";
  backlight: "RGB" | "Single-color" | "None";
  wireless: boolean;
}

export const keyboards: KeyboardEntry[] = [
  { name: "K120", brand: "Logitech", switchType: "Membrane", layout: "Full-size", backlight: "None", wireless: false, tier: "budget", price: 15, releaseYear: 2019 },
  { name: "G213 Prodigy", brand: "Logitech", switchType: "Membrane", layout: "Full-size", backlight: "RGB", wireless: false, tier: "budget", price: 50, releaseYear: 2018 },
  { name: "Cynosa V2", brand: "Razer", switchType: "Membrane", layout: "Full-size", backlight: "RGB", wireless: false, tier: "budget", price: 60, releaseYear: 2020 },
  { name: "Apex 3", brand: "SteelSeries", switchType: "Membrane", layout: "Full-size", backlight: "RGB", wireless: false, tier: "budget", price: 60, releaseYear: 2020 },
  { name: "G413 SE", brand: "Logitech", switchType: "Mechanical Tactile", layout: "TKL", backlight: "Single-color", wireless: false, tier: "mid", price: 70, releaseYear: 2021 },
  { name: "K65 RGB Mini", brand: "Corsair", switchType: "Cherry MX Speed", layout: "60%", backlight: "RGB", wireless: false, tier: "mid", price: 110, releaseYear: 2021 },
  { name: "Huntsman Mini", brand: "Razer", switchType: "Razer Optical", layout: "60%", backlight: "RGB", wireless: false, tier: "mid", price: 120, releaseYear: 2020 },
  { name: "K70 RGB PRO", brand: "Corsair", switchType: "Cherry MX Red", layout: "Full-size", backlight: "RGB", wireless: false, tier: "high", price: 170, releaseYear: 2022 },
  { name: "BlackWidow V4", brand: "Razer", switchType: "Razer Green", layout: "Full-size", backlight: "RGB", wireless: false, tier: "high", price: 170, releaseYear: 2023 },
  { name: "Apex Pro", brand: "SteelSeries", switchType: "OmniPoint Adjustable", layout: "Full-size", backlight: "RGB", wireless: false, tier: "enthusiast", price: 200, releaseYear: 2022 },
  { name: "G915 TKL", brand: "Logitech", switchType: "GL Tactile", layout: "TKL", backlight: "RGB", wireless: true, tier: "enthusiast", price: 230, releaseYear: 2021 },
  { name: "K100 RGB", brand: "Corsair", switchType: "OPX Optical", layout: "Full-size", backlight: "RGB", wireless: false, tier: "enthusiast", price: 230, releaseYear: 2020 },
];
