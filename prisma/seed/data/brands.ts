export interface BrandSeed {
  name: string;
  slug: string;
  description: string;
}

const brandList = [
  "Intel",
  "AMD",
  "NVIDIA",
  "ASUS",
  "MSI",
  "Gigabyte",
  "ASRock",
  "Corsair",
  "G.Skill",
  "Kingston",
  "Crucial",
  "Samsung",
  "Western Digital",
  "Seagate",
  "Seasonic",
  "EVGA",
  "Cooler Master",
  "be quiet!",
  "NZXT",
  "Fractal Design",
  "Lian Li",
  "Noctua",
  "Arctic",
  "LG",
  "Dell",
  "Acer",
  "Logitech",
  "Razer",
  "SteelSeries",
  "HyperX",
  "TP-Link",
  "Netgear",
  "CableMod",
  "Thermal Grizzly",
  "Zotac",
  "Sapphire",
  "PowerColor",
] as const;

export const brands: BrandSeed[] = brandList.map((name) => ({
  name,
  slug: name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, ""),
  description: `${name} computer hardware and components.`,
}));
