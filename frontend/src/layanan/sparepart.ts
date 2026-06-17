import { api } from './api';
import type { SparepartFilter, SparepartBuat, SparepartUbah } from '@/skema/sparepart';

export interface SparepartResponse {
  id: string;
  idTampilan: string;
  nama: string;
  kategori: string;
  stok: number;
  stokMinimal: number;
  satuan: string;
  hargaJual: string;
  hargaBeli: string | null;
}

export interface SparepartListResponse {
  data: SparepartResponse[];
  meta: { total: number; page: number; limit: number };
}

export const sparepartLayanan = {
  daftar: async (filter: Partial<SparepartFilter> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    const res = await api.get<SparepartListResponse>(`/sparepart?${params}`);
    return res.data;
  },

  buat: async (data: SparepartBuat) => {
    const res = await api.post<{ data: SparepartResponse }>('/sparepart', data);
    return res.data;
  },

  ubah: async (id: string, data: Partial<SparepartUbah>) => {
    const res = await api.patch<{ data: SparepartResponse }>(`/sparepart/${id}`, data);
    return res.data;
  },

  hapus: async (id: string) => {
    await api.delete(`/sparepart/${id}`);
  },
};