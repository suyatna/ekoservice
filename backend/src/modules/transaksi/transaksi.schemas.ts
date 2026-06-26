import { z } from 'zod';
import { JenisTransaksi } from '@prisma/client';

export const skemaTransaksiBuat = z.object({
  deskripsi: z.string().min(3).max(500).trim(),
  jenis: z.nativeEnum(JenisTransaksi),
  nominal: z.number().min(0, 'Nominal harus positif'),
  dibuatDi: z.string().optional(),
});

export const skemaTransaksiUbah = z.object({
  deskripsi: z.string().min(3).max(500).optional(),
  jenis: z.nativeEnum(JenisTransaksi).optional(),
  nominal: z.number().min(0).optional(),
  dibuatDi: z.string().optional(),
});

export const skemaTransaksiFilter = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  jenis: z.nativeEnum(JenisTransaksi).optional(),
  dari: z.string().optional(),
  sampai: z.string().optional(),
});

export type SkemaTransaksiBuat = z.infer<typeof skemaTransaksiBuat>;
export type SkemaTransaksiUbah = z.infer<typeof skemaTransaksiUbah>;
export type SkemaTransaksiFilter = z.infer<typeof skemaTransaksiFilter>;
