export type Role = 'ADMIN';

export type StatusBooking =
  | 'MENUNGGU'
  | 'SERVIS'
  | 'SELESAI'
  | 'DIBATALKAN';

export interface User { id: string; nama: string; email: string; role: Role; token?: string }
export interface Booking { id: string; pelanggan: string; kategori: string; status: StatusBooking }
