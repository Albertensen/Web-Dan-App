import { z } from "zod"

export const checkoutSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().regex(/^08\d{8,12}$/, "No HP tidak valid (contoh: 081234567890)"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  province: z.string().min(2, "Provinsi wajib diisi"),
  city: z.string().min(2, "Kota wajib diisi"),
  district: z.string().min(2, "Kecamatan wajib diisi"),
  postal_code: z.string().regex(/^\d{5}$/, "Kode pos harus 5 digit"),
  courier: z.enum(["jne", "jnt", "sicepat", "grab", "gosend"], "Pilih kurir"),
  notes: z.string().optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>