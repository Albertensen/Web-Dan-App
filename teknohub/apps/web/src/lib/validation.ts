import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
  shippingAddress: z.object({
    name: z.string().min(1),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().regex(/^\d{5}$/),
    country: z.string().min(2),
  }),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "cash"]),
});

export const forumPostSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
});

export const commentSchema = z.object({
  content: z.string().min(5),
});

export const uploadSchema = z.object({
  path: z.string().min(1),
  contentType: z.string().regex(/^image\//),
});

export const supportChatSchema = z.object({
  message: z.string().min(1),
});