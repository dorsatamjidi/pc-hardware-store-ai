import type { ProductType } from "@prisma/client";

export interface CategorySeed {
  type: ProductType;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export const categories: CategorySeed[] = [
  { type: "CPU", name: "Processors", slug: "cpus", description: "Desktop CPUs from Intel and AMD, from budget to enthusiast.", sortOrder: 1 },
  { type: "MOTHERBOARD", name: "Motherboards", slug: "motherboards", description: "AM4, AM5, and LGA1700 motherboards in ATX, Micro-ATX, and Mini-ITX.", sortOrder: 2 },
  { type: "RAM", name: "Memory", slug: "memory", description: "DDR4 and DDR5 desktop memory kits.", sortOrder: 3 },
  { type: "GPU", name: "Graphics Cards", slug: "graphics-cards", description: "NVIDIA and AMD graphics cards for gaming, creation, and AI workloads.", sortOrder: 4 },
  { type: "STORAGE", name: "Storage", slug: "storage", description: "NVMe SSDs, SATA SSDs, and hard drives.", sortOrder: 5 },
  { type: "PSU", name: "Power Supplies", slug: "power-supplies", description: "ATX power supplies from 450W to 1200W.", sortOrder: 6 },
  { type: "CASE", name: "Cases", slug: "cases", description: "ATX, Micro-ATX, and Mini-ITX cases.", sortOrder: 7 },
  { type: "COOLER", name: "CPU Coolers", slug: "cpu-coolers", description: "Air and liquid CPU coolers.", sortOrder: 8 },
  { type: "FAN", name: "Case Fans", slug: "case-fans", description: "120mm and 140mm case fans.", sortOrder: 9 },
  { type: "MONITOR", name: "Monitors", slug: "monitors", description: "1080p, 1440p, and 4K monitors at a range of refresh rates.", sortOrder: 10 },
  { type: "KEYBOARD", name: "Keyboards", slug: "keyboards", description: "Mechanical and membrane keyboards.", sortOrder: 11 },
  { type: "MOUSE", name: "Mice", slug: "mice", description: "Wired and wireless gaming and productivity mice.", sortOrder: 12 },
  { type: "HEADSET", name: "Headsets", slug: "headsets", description: "Gaming and productivity headsets.", sortOrder: 13 },
  { type: "NETWORK_CARD", name: "Networking", slug: "networking", description: "Wi-Fi cards and network adapters.", sortOrder: 14 },
  { type: "CABLE", name: "Cables & Adapters", slug: "cables", description: "Cables, extensions, and adapters.", sortOrder: 15 },
  { type: "THERMAL_PASTE", name: "Thermal Paste", slug: "thermal-paste", description: "Thermal compounds for CPU and GPU coolers.", sortOrder: 16 },
];
