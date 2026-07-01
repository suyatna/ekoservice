import { z } from 'zod';

// ──────────────────────────────────────────────────────────
// Auth Zod Schemas
// Dipakai di: backend (Fastify) + frontend (React Hook Form)
// ──────────────────────────────────────────────────────────

export const skemaMasuk = z.object({
  username: z
    .string({ required_error: 'Username wajib diisi' })
    .min(3, 'Username minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(8, 'Password minimal 8 karakter'),
});

// ──────────────────────────────────────────────────────────
// Response schemas
// ──────────────────────────────────────────────────────────

export const schemaUser = z.object({
  id: z.string(),
  nama: z.string(),
  username: z.string().nullable().optional(),
  role: z.string(),
  aktif: z.boolean(),
});

export const schemaLoginResponse = z.object({
  accessToken: z.string(),
  user: schemaUser,
  refreshToken: z.string().optional(),
});

export type SkemaMasuk = z.infer<typeof skemaMasuk>;
export type SchemaUser = z.infer<typeof schemaUser>;
export type SchemaLoginResponse = z.infer<typeof schemaLoginResponse>;
