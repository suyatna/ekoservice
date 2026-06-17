import { StatusBooking } from '@/types';

export const warnaStatusBooking: Record<StatusBooking, string> = {
  BOOKING_DIBUAT: 'bg-section',
  MENUNGGU_PENUGASAN: 'bg-peringatan',
  TEKNISI_DITUGASKAN: 'bg-aksen',
  TEKNISI_MENUJU_LOKASI: 'bg-aksen',
  TEKNISI_TIBA: 'bg-aksen',
  DIAGNOSIS_DIMULAI: 'bg-aksen',
  PENAWARAN_DIBUAT: 'bg-aksen',
  MENUNGGU_PERSETUJUAN_PELANGGAN: 'bg-peringatan',
  DISETUJUI_PELANGGAN: 'bg-sukses',
  SERVIS_DIMULAI: 'bg-aksen',
  SERVIS_SELESAI: 'bg-sukses',
  MENUNGGU_PEMBAYARAN: 'bg-peringatan',
  PEMBAYARAN_DITERIMA: 'bg-sukses',
  SELESAI: 'bg-sukses',
  DIBATALKAN_PELANGGAN: 'bg-bahaya',
  DIBATALKAN_ADMIN: 'bg-bahaya',
  DIBATALKAN_SISTEM: 'bg-bahaya'
};
