export const TEST_DATABASE_URL = "postgresql://pcstore:pcstore@localhost:5432/pcstore_test";
export const TEST_DB_NAME = "pcstore_test";

/** Fixture slugs/ids used across integration tests — created once in global setup. */
export const FIXTURE = {
  categorySlugs: { cpu: "cpus", motherboard: "motherboards", ram: "memory" },
  brandSlug: "test-brand",
  products: {
    cpuAm5: "test-cpu-am5",
    cpuAm4: "test-cpu-am4",
    moboAm5Ddr5: "test-mobo-am5-ddr5",
    moboAm4Ddr4: "test-mobo-am4-ddr4",
    ramDdr5: "test-ram-ddr5",
    outOfStock: "test-out-of-stock",
    lowStock: "test-low-stock",
  },
};
