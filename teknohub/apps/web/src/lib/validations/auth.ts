import { z } from "zod";

/** Login: email valid + password minimal */
export const loginSchema = z.object({
  email: z.string().trim().email("Alamat email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Register: username, email, password, konfirmasi, T&C */
export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter")
      .max(20, "Username maksimal 20 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Hanya huruf, angka, dan underscore"),
    email: z.string().trim().email("Alamat email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
    terms: z.boolean().refine((v) => v === true, {
      message: "Anda harus menyetujui syarat & ketentuan",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });
export type RegisterInput = z.infer<typeof registerSchema>;

/** Forgot password: hanya email */
export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Alamat email tidak valid"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/** Reset password: password baru + konfirmasi */
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
