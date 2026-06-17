import { z } from 'zod';

export const skemaTransaksiFilter = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  jenis: z.enum(['MASUK', 'KELUAR']).optional(),
  dari: z.string().optional(),
  sampai: z.string().optional(),
});

export const skemaTransaksiBuat = z.object({
  deskripsi: z.string().min(3, 'Deskripsi minimal 3 karakter').max(200),
  jenis: z.enum(['MASUK', 'KELUAR']),
  nominal: z.number().min(0, 'Nominal harus positif'),
  metodeBayar: z.string().optional(),
  bookingId: z.string().uuid().optional().nullable(),
});

export const skemaTransaksiUbah = z.object({
  deskripsi: z.string().min(3).max(200).optional(),
  jenis: z.enum(['MASUK', 'KELUAR']).optional(),
  nominal: z.number().min(0).optional(),
  metodeBayar: z.string().optional().nullable(),
  dibuatDi: z.string().optional(),
});

export type TransaksiFilter = z.infer<typeof skemaTransaksiFilter>;
export type TransaksiBuat = z.infer<typeof skemaTransaksiBuat>;
export type TransaksiUbah = z.infer<typeof skemaTransaksiUbah>;
