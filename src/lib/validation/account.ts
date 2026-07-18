import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters").max(72),
  });

const addressBaseSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(40),
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  phone: z.string().trim().min(5, "Phone number is required").max(30),
  line1: z.string().trim().min(3, "Address is required").max(150),
  line2: z.string().trim().max(150).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required").max(80),
  state: z.string().trim().min(1, "State/province is required").max(80),
  postalCode: z.string().trim().min(1, "Postal code is required").max(20),
  country: z.string().trim().min(1, "Country is required").max(80),
});

// Create: `isDefault` defaults to false when omitted.
export const addressSchema = addressBaseSchema.extend({
  isDefault: z.boolean().optional().default(false),
});

// Update: `isDefault` is left untouched (no default) when omitted, so a PATCH
// that doesn't mention it can't silently clear an existing default address.
export const addressUpdateSchema = addressBaseSchema.partial().extend({
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
