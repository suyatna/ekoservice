export type Role = 'SUPER_ADMIN' | 'ADMIN_OPERASIONAL' | 'CUSTOMER' | 'TEKNISI' | 'FINANCE' | 'WAREHOUSE';

export type StatusBooking =
  | 'BOOKING_DIBUAT'
  | 'MENUNGGU_PENUGASAN'
  | 'TEKNISI_DITUGASKAN'
  | 'TEKNISI_MENUJU_LOKASI'
  | 'TEKNISI_TIBA'
  | 'DIAGNOSIS_DIMULAI'
  | 'PENAWARAN_DIBUAT'
  | 'MENUNGGU_PERSETUJUAN_PELANGGAN'
  | 'DISETUJUI_PELANGGAN'
  | 'SERVIS_DIMULAI'
  | 'SERVIS_SELESAI'
  | 'MENUNGGU_PEMBAYARAN'
  | 'PEMBAYARAN_DITERIMA'
  | 'SELESAI'
  | 'DIBATALKAN_PELANGGAN'
  | 'DIBATALKAN_ADMIN'
  | 'DIBATALKAN_SISTEM';

export interface User { id: string; nama: string; email: string; role: Role; token?: string }
export interface Booking { id: string; pelanggan: string; kategori: string; status: StatusBooking }
