import { z } from 'zod';
import { JenisTransaksi } from '@prisma/client';
export const skemaTransaksiBuat = z.object({
    deskripsi: z.string().min(3).max(500).trim(),
    jenis: z.nativeEnum(JenisTransaksi),
    nominal: z.number().min(1000, 'Nominal minimal Rp 1.000'),
    metodeBayar: z.string().max(50).optional(),
    bookingId: z.string().uuid().optional().nullable(),
});
export const skemaTransaksiUbah = z.object({
    deskripsi: z.string().min(3).max(500).optional(),
    nominal: z.number().min(1000).optional(),
    metodeBayar: z.string().max(50).optional().nullable(),
});
export const skemaTransaksiFilter = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    search: z.string().optional(),
    jenis: z.nativeEnum(JenisTransaksi).optional(),
    dari: z.string().optional(),
    sampai: z.string().optional(),
});
//# sourceMappingURL=transaksi.schemas.js.map