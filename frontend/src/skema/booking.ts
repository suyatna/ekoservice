import { z } from 'zod';

export const statusGroupConfig: Record<string, { label: string; statuses: string[] }> = {
  MENUNGGU:   { label: 'Menunggu', statuses: ['BOOKING_DIBUAT', 'MENUNGGU_PENUGASAN', 'TEKNISI_DITUGASKAN', 'TEKNISI_MENUJU_LOKASI', 'TEKNISI_TIBA', 'DIAGNOSIS_DIMULAI', 'PENAWARAN_DIBUAT', 'MENUNGGU_PERSETUJUAN_PELANGGAN', 'DISETUJUI_PELANGGAN'] },
  SERVIS:     { label: 'Service', statuses: ['SERVIS_DIMULAI', 'SERVIS_SELESAI', 'MENUNGGU_PEMBAYARAN', 'PEMBAYARAN_DITERIMA'] },
  SELESAI:    { label: 'Selesai', statuses: ['SELESAI'] },
  DIBATALKAN: { label: 'Batal', statuses: ['DIBATALKAN_PELANGGAN', 'DIBATALKAN_ADMIN', 'DIBATALKAN_SISTEM'] },
};

export const kategoriOptions: Record<string, string> = {
  SERVICE_AC:         'Service AC',
  SERVICE_KULKAS:      'Service Kulkas',
  SERVICE_MESIN_CUCI:  'Service Mesin Cuci',
  SERVICE_CHILLER:    'Service Chiller',
  SERVICE_SHOWCASE:   'Service Showcase',
  SERVICE_TV:         'Service TV',
};

export const skemaBookingFilter = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.string().optional(),
  kategori: z.string().optional(),
  dari: z.string().optional(),
  sampai: z.string().optional(),
});

export const skemaBookingBuat = z.object({
  namaPelanggan: z.string().min(2, 'Nama minimal 2 karakter').max(100).trim(),
  noTelpPelanggan: z
    .string()
    .transform((value) => value.replace(/[\s.-]/g, ''))
    .refine((value) => value === '' || /^(\+62|62|0)[0-9]{8,13}$/.test(value), 'Nomor WhatsApp tidak valid'),
  kategori: z.enum(['SERVICE_AC', 'SERVICE_KULKAS', 'SERVICE_MESIN_CUCI', 'SERVICE_CHILLER', 'SERVICE_SHOWCASE', 'SERVICE_TV']),
  tglBooking: z.string(),
});

export const skemaBookingUbah = z.object({
  namaPelanggan: z.string().min(2, 'Nama minimal 2 karakter').max(100).trim().optional(),
  noTelpPelanggan: z
    .string()
    .transform((value) => value.replace(/[\s.-]/g, ''))
    .refine((value) => value === '' || /^(\+62|62|0)[0-9]{8,13}$/.test(value), 'Nomor WhatsApp tidak valid')
    .optional(),
  kategori: z.enum(['SERVICE_AC', 'SERVICE_KULKAS', 'SERVICE_MESIN_CUCI', 'SERVICE_CHILLER', 'SERVICE_SHOWCASE', 'SERVICE_TV']).optional(),
  tglBooking: z.string().optional(),
  status: z.string().optional(),
});

export type BookingFilter = z.infer<typeof skemaBookingFilter>;
export type BookingBuat = z.infer<typeof skemaBookingBuat>;
export type BookingUbah = z.infer<typeof skemaBookingUbah>;
