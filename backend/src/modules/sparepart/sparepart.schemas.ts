import { z } from 'zod';
import { KategoriSparepart } from '@prisma/client';

export const skemaSparepartBuat = z.object({
  nama: z.string().min(2).max(200).trim(),
  kategori: z.nativeEnum(KategoriSparepart),
  stok: z.number().int().min(0).default(0),
  stokMinimal: z.number().int().min(0).default(5),
  satuan: z.string().min(1).max(20).default('pcs'),
  hargaBeli: z.number().min(0).optional().nullable(),
});

export const skemaSparepartUbah = z.object({
  nama: z.string().min(2).max(200).optional(),
  kategori: z.nativeEnum(KategoriSparepart).optional(),
  stok: z.number().int().min(0).optional(),
  stokMinimal: z.number().int().min(0).optional(),
  satuan: z.string().min(1).max(20).optional(),
  hargaBeli: z.number().min(0).optional().nullable(),
});

export const skemaSparepartFilter = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  kategori: z.nativeEnum(KategoriSparepart).optional(),
  stokLevel: z.enum(['ALL', 'HAMPA', 'KRITIS', 'AMAN']).default('ALL'),
});

export type SkemaSparepartBuat = z.infer<typeof skemaSparepartBuat>;
export type SkemaSparepartUbah = z.infer<typeof skemaSparepartUbah>;
export type SkemaSparepartFilter = z.infer<typeof skemaSparepartFilter>;