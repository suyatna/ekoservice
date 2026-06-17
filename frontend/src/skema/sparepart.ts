import { z } from 'zod';

export const kategoriSparepartOptions: Record<string, string> = {
  KULKAS: 'Kulkas',
  AC: 'AC',
  MESIN_CUCI: 'Mesin Cuci',
  SHOWCASE: 'Showcase',
  TV: 'TV',
};

export const skemaSparepartFilter = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  kategori: z.string().optional(),
});

export const skemaSparepartBuat = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  kategori: z.enum(['KULKAS', 'AC', 'MESIN_CUCI', 'SHOWCASE', 'TV']),
  stok: z.coerce.number().min(0).default(0),
  stokMinimal: z.coerce.number().min(0).default(5),
  satuan: z.string().min(1).max(20).default('pcs'),
  hargaJual: z.number().min(0),
  hargaBeli: z.number().min(0).optional().nullable(),
});

export const skemaSparepartUbah = z.object({
  nama: z.string().min(2).max(100).optional(),
  kategori: z.enum(['KULKAS', 'AC', 'MESIN_CUCI', 'SHOWCASE', 'TV', 'UMUM']).optional(),
  stok: z.number().min(0).optional(),
  stokMinimal: z.number().min(0).optional(),
  satuan: z.string().min(1).max(20).optional(),
  hargaJual: z.number().min(0).optional(),
  hargaBeli: z.number().min(0).optional().nullable(),
});

export type SparepartFilter = z.infer<typeof skemaSparepartFilter>;
export type SparepartBuat = z.infer<typeof skemaSparepartBuat>;
export type SparepartUbah = z.infer<typeof skemaSparepartUbah>;