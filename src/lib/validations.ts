import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const FORMATS = ["HARDCOPY", "SOFTCOPY", "AUDIO_BOOK"] as const;

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional().default(""),
  isbn: z.string().optional().default(""),
  pages: z.number().int().optional().default(0),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional().default(""),
  images: z.string().optional().default("[]"),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
});

export const variantSchema = z.object({
  format: z.enum(FORMATS),
  price: z.number().min(0, "Price must be 0 or more"),
  comparePrice: z.number().optional().default(0),
  stock: z.number().int().optional().default(0),
  sku: z.string().optional().default(""),
  downloadUrl: z.string().optional().default(""),
});

export const bookWithVariantsSchema = bookSchema.extend({
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
});

export const cartItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

export const reviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().default(""),
});

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional().default(""),
  content: z.string().optional().default(""),
  author: z.string().optional().default("Dr. Isaiah Wealth"),
  category: z.string().optional().default("General"),
  imageUrl: z.string().optional().default(""),
  published: z.boolean().optional().default(true),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().default(""),
  message: z.string().min(1, "Message is required"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const checkoutSchema = z.object({
  shippingAddressId: z.string().optional(),
  shipping: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().optional().default("Nigeria"),
  }),
});
