import { api } from './api';
import type { TransaksiFilter, TransaksiBuat, TransaksiUbah } from '@/skema/transaksi';

export interface TransaksiResponse {
  id: string;
  idTampilan: string;
  deskripsi: string;
  jenis: 'MASUK' | 'KELUAR';
  nominal: string;
  dibuatDi: string;
}

export interface TransaksiListResponse {
  data: TransaksiResponse[];
  meta: { total: number; page: number; limit: number };
}

export const transaksiLayanan = {
  daftar: async (filter: Partial<TransaksiFilter> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    const res = await api.get<TransaksiListResponse>(`/transaksi?${params}`);
    return res.data;
  },

  buat: async (data: TransaksiBuat) => {
    const res = await api.post<{ data: TransaksiResponse }>('/transaksi', data);
    return res.data;
  },

  ubah: async (id: string, data: Partial<TransaksiUbah>) => {
    const res = await api.patch<{ data: TransaksiResponse }>(`/transaksi/${id}`, data);
    return res.data;
  },

  hapus: async (id: string) => {
    await api.delete(`/transaksi/${id}`);
  },
};
