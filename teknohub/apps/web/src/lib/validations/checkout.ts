import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().regex(/^08\d{8,12}$/, "No HP tidak valid (contoh: 081234567890)"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  province: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  postal_code: z.string().optional().or(z.literal("")),
  courier: z.string().min(1, "Pilih kurir / metode pengiriman"),
  service: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
