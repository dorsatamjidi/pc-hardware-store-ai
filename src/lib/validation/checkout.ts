import { z } from "zod";

export const checkoutSchema = z.object({
  addressId: z.string().min(1, "Select a shipping address"),
});
