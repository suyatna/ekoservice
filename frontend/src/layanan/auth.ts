import { z } from 'zod';
import { api } from './api';
import { skemaMasuk } from '@/skema/auth';
import { tokenStorage } from '@/utils/token';
import type { Role } from '@/types';

export interface User {
  id: string;
  nama: string;
  username?: string | null;
  role: Role;
  aktif: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const authLayanan = {
  async masuk(data: z.infer<typeof skemaMasuk>): Promise<LoginResponse> {
    const res = await api.post<{ data: LoginResponse }>('/auth/login', data);
    const { accessToken, user } = res.data.data;

    // Simpan token
    tokenStorage.setToken(accessToken);

    return { accessToken, user };
  },

  async me(): Promise<User> {
    const res = await api.get<{ data: User }>('/auth/me');
    return res.data.data;
  },

  async refresh(): Promise<LoginResponse> {
    const res = await api.post<{ data: LoginResponse }>('/auth/refresh');
    const { accessToken, user } = res.data.data;
    tokenStorage.setToken(accessToken);
    return { accessToken, user };
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (err: any) {
      // 401 = token sudah expired/revoked, tidak perlu cleanup tambahan
      if (err.response?.status !== 401) {
        throw err;
      }
    } finally {
      tokenStorage.hapus();
    }
  },
};
