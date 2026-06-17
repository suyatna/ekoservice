import { z } from 'zod';
import { KategoriLayanan, StatusBooking } from '@prisma/client';
// ──────────────────────────────────────────────────────────
// Booking Zod Schemas
// ──────────────────────────────────────────────────────────
export const skemaBookingBuat = z.object({
    namaPelanggan: z
        .string()
        .min(2, 'Nama minimal 2 karakter')
        .max(100)
        .trim(),
    noTelpPelanggan: z
        .string()
        .transform((value) => value.replace(/[\s.-]/g, ''))
        .refine((value) => value === '' || /^(\+62|62|0)[0-9]{8,13}$/.test(value), 'Nomor WhatsApp tidak valid'),
    kategori: z.nativeEnum(KategoriLayanan),
    tglBooking: z.string().optional(),
});
export const skemaBookingUbah = z.object({
    namaPelanggan: z
        .string()
        .min(2, 'Nama minimal 2 karakter')
        .max(100)
        .trim()
        .optional(),
    noTelpPelanggan: z
        .string()
        .transform((value) => value.replace(/[\s.-]/g, ''))
        .refine((value) => value === '' || /^(\+62|62|0)[0-9]{8,13}$/.test(value), 'Nomor WhatsApp tidak valid')
        .optional(),
    kategori: z.nativeEnum(KategoriLayanan).optional(),
    tglBooking: z.string().optional(),
    status: z.nativeEnum(StatusBooking).optional(),
});
export const skemaBookingFilter = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    search: z.string().optional(),
    status: z.nativeEnum(StatusBooking).optional(),
    kategori: z.nativeEnum(KategoriLayanan).optional(),
    dari: z.string().datetime().optional(),
    sampai: z.string().datetime().optional(),
});
//# sourceMappingURL=booking.schemas.js.map