import { api } from './api';
import type { BookingFilter, BookingBuat, BookingUbah } from '@/skema/booking';

export interface BookingResponse {
  id: string;
  idTampilan: string;
  namaPelanggan: string;
  noTelpPelanggan: string;
  kategori: string;
  tglBooking: string;
  status: string;
  dibuatDi: string;
  dibuatOleh: { id: string; nama: string };
}

export interface BookingListResponse {
  data: BookingResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const bookingLayanan = {
  daftar: async (filter: Partial<BookingFilter> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    const res = await api.get<BookingListResponse>(`/booking?${params}`);
    return res.data;
  },

  buat: async (data: BookingBuat) => {
    const res = await api.post<{ data: BookingResponse }>('/booking', data);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<{ data: BookingResponse }>(`/booking/${id}`);
    return res.data;
  },

  ubah: async (id: string, data: Partial<BookingUbah>) => {
    const res = await api.patch<{ data: BookingResponse }>(`/booking/${id}`, data);
    return res.data;
  },

  hapus: async (id: string) => {
    await api.delete(`/booking/${id}`);
  },
};
