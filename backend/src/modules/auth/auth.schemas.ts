import { z } from 'zod';

// ──────────────────────────────────────────────────────────
// Auth Zod Schemas
// Dipakai di: backend (Fastify) + frontend (React Hook Form)
// ──────────────────────────────────────────────────────────

export const skemaMasuk = z.object({
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid'),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(8, 'Password minimal 8 karakter'),
});

export const skemaDaftar = z.object({
  nama: z
    .string({ required_error: 'Nama wajib diisi' })
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim(),
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
});

export const skemaLupaPassword = z.object({
  email: z.string().email('Format email tidak valid'),
});

export const skemaResetPassword = z.object({
  token: z.string().min(1, 'Token wajib diisi'),
  passwordBaru: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
});

// ──────────────────────────────────────────────────────────
// Response schemas
// ──────────────────────────────────────────────────────────

export const schemaUser = z.object({
  id: z.string(),
  nama: z.string(),
  email: z.string(),
  role: z.string(),
  noTelp: z.string().nullable(),
  aktif: z.boolean(),
  dibuatDi: z.string().datetime(),
});

export const schemaLoginResponse = z.object({
  accessToken: z.string(),
  user: schemaUser,
  refreshToken: z.string().optional(), // hanya untuk register
});

export type SkemaMasuk = z.infer<typeof skemaMasuk>;
export type SkemaDaftar = z.infer<typeof skemaDaftar>;
export type SchemaUser = z.infer<typeof schemaUser>;
export type SchemaLoginResponse = z.infer<typeof schemaLoginResponse>;
