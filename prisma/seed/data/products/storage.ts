import type { BaseEntry } from "./types";

export interface StorageEntry extends BaseEntry {
  capacityGb: number;
  formFactor: "2.5_INCH" | "M2_2280" | "3.5_INCH";
  driveInterface: "SATA_3" | "NVME_PCIE3_X4" | "NVME_PCIE4_X4" | "NVME_PCIE5_X4";
  readSpeedMbps: number;
  writeSpeedMbps: number;
  nandType: string;
}

export const storageDrives: StorageEntry[] = [
  // SATA SSD
  { name: "870 EVO 500GB", brand: "Samsung", capacityGb: 500, formFactor: "2.5_INCH", driveInterface: "SATA_3", readSpeedMbps: 560, writeSpeedMbps: 530, nandType: "TLC", tier: "budget", price: 45, releaseYear: 2021 },
  { name: "870 EVO 1TB", brand: "Samsung", capacityGb: 1000, formFactor: "2.5_INCH", driveInterface: "SATA_3", readSpeedMbps: 560, writeSpeedMbps: 530, nandType: "TLC", tier: "budget", price: 75, releaseYear: 2021 },
  { name: "MX500 1TB", brand: "Crucial", capacityGb: 1000, formFactor: "2.5_INCH", driveInterface: "SATA_3", readSpeedMbps: 560, writeSpeedMbps: 510, nandType: "TLC", tier: "budget", price: 70, releaseYear: 2018 },
  { name: "Blue 3D NAND 1TB", brand: "Western Digital", capacityGb: 1000, formFactor: "2.5_INCH", driveInterface: "SATA_3", readSpeedMbps: 560, writeSpeedMbps: 530, nandType: "TLC", tier: "budget", price: 65, releaseYear: 2019 },
  { name: "A400 480GB", brand: "Kingston", capacityGb: 480, formFactor: "2.5_INCH", driveInterface: "SATA_3", readSpeedMbps: 500, writeSpeedMbps: 450, nandType: "TLC", tier: "budget", price: 30, releaseYear: 2017 },
  // NVMe Gen3
  { name: "P3 1TB NVMe", brand: "Crucial", capacityGb: 1000, formFactor: "M2_2280", driveInterface: "NVME_PCIE3_X4", readSpeedMbps: 3500, writeSpeedMbps: 3000, nandType: "QLC", tier: "budget", price: 55, releaseYear: 2022 },
  { name: "Blue SN570 1TB", brand: "Western Digital", capacityGb: 1000, formFactor: "M2_2280", driveInterface: "NVME_PCIE3_X4", readSpeedMbps: 3500, writeSpeedMbps: 3000, nandType: "TLC", tier: "budget", price: 60, releaseYear: 2021 },
  { name: "970 EVO Plus 1TB", brand: "Samsung", capacityGb: 1000, formFactor: "M2_2280", driveInterface: "NVME_PCIE3_X4", readSpeedMbps: 3500, writeSpeedMbps: 3300, nandType: "TLC", tier: "mid", price: 80, releaseYear: 2019 },
  // NVMe Gen4
  { name: "980 PRO 1TB", brand: "Samsung", capacityGb: 1000, formFactor: "M2_2280", driveInterface: "NVME_PCIE4_X4", readSpeedMbps: 7000, writeSpeedMbps: 5000, nandType: "TLC", tier: "high", price: 110, releaseYear: 2020 },
  { name: "990 PRO 2TB", brand: "Samsung", capacityGb: 2000, formFactor: "M2_2280", driveInterface: "NVME_PCIE4_X4", readSpeedMbps: 7450, writeSpeedMbps: 6900, nandType: "TLC", tier: "enthusiast", price: 170, releaseYear: 2022 },
  { name: "Black SN850X 1TB", brand: "Western Digital", capacityGb: 1000, formFactor: "M2_2280", driveInterface: "NVME_PCIE4_X4", readSpeedMbps: 7300, writeSpeedMbps: 6300, nandType: "TLC", tier: "high", price: 100, releaseYear: 2022 },
  { name: "Black SN850X 2TB", brand: "Western Digital", capacityGb: 2000, formFactor: "M2_2280", driveInterface: "NVME_PCIE4_X4", readSpeedMbps: 7300, writeSpeedMbps: 6600, nandType: "TLC", tier: "enthusiast", price: 160, releaseYear: 2022 },
  { name: "T500 1TB", brand: "Crucial", capacityGb: 1000, formFactor: "M2_2280", driveInterface: "NVME_PCIE4_X4", readSpeedMbps: 7400, writeSpeedMbps: 7000, nandType: "TLC", tier: "high", price: 95, releaseYear: 2023 },
  { name: "FireCuda 530 1TB", brand: "Seagate", capacityGb: 1000, formFactor: "M2_2280", driveInterface: "NVME_PCIE4_X4", readSpeedMbps: 7300, writeSpeedMbps: 6000, nandType: "TLC", tier: "high", price: 105, releaseYear: 2021 },
  { name: "FireCuda 530 2TB", brand: "Seagate", capacityGb: 2000, formFactor: "M2_2280", driveInterface: "NVME_PCIE4_X4", readSpeedMbps: 7300, writeSpeedMbps: 6900, nandType: "TLC", tier: "enthusiast", price: 175, releaseYear: 2021 },
  { name: "KC3000 1TB", brand: "Kingston", capacityGb: 1000, formFactor: "M2_2280", driveInterface: "NVME_PCIE4_X4", readSpeedMbps: 7000, writeSpeedMbps: 7000, nandType: "TLC", tier: "high", price: 90, releaseYear: 2022 },
  // NVMe Gen5
  { name: "T700 1TB", brand: "Crucial", capacityGb: 1000, formFactor: "M2_2280", driveInterface: "NVME_PCIE5_X4", readSpeedMbps: 12400, writeSpeedMbps: 11800, nandType: "TLC", tier: "enthusiast", price: 150, releaseYear: 2023 },
  { name: "9100 PRO 2TB", brand: "Samsung", capacityGb: 2000, formFactor: "M2_2280", driveInterface: "NVME_PCIE5_X4", readSpeedMbps: 14800, writeSpeedMbps: 13400, nandType: "TLC", tier: "enthusiast", price: 230, releaseYear: 2024 },
  { name: "Black SN8100 2TB", brand: "Western Digital", capacityGb: 2000, formFactor: "M2_2280", driveInterface: "NVME_PCIE5_X4", readSpeedMbps: 14900, writeSpeedMbps: 14800, nandType: "TLC", tier: "enthusiast", price: 240, releaseYear: 2024 },
  // HDD (bulk storage — driveInterface reused as SATA_3 connector)
  { name: "BarraCuda 2TB HDD", brand: "Seagate", capacityGb: 2000, formFactor: "3.5_INCH", driveInterface: "SATA_3", readSpeedMbps: 190, writeSpeedMbps: 190, nandType: "N/A", tier: "budget", price: 55, releaseYear: 2021 },
  { name: "Blue 4TB HDD", brand: "Western Digital", capacityGb: 4000, formFactor: "3.5_INCH", driveInterface: "SATA_3", readSpeedMbps: 175, writeSpeedMbps: 175, nandType: "N/A", tier: "budget", price: 90, releaseYear: 2021 },
];
