import axios, { type AxiosInstance } from 'axios';
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';
import { pakaiAuthStore } from '@/store/auth';
import { tokenStorage } from '@/utils/token';

export const api: AxiosInstance = axios.create({
  baseURL: '/', // Vite proxy handles routing
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // Skip Authorization for public auth endpoints (no token needed, stale token causes 401)
  const isPublicAuth = ['/auth/login', '/auth/register', '/auth/refresh'].some(
    (p) => config.url?.startsWith(p)
  );

  if (!isPublicAuth) {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  config.headers['X-API-Key'] = import.meta.env.VITE_API_KEY ?? '';
  config.headers['X-Request-ID'] = uuid();
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as any;
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const message = error.response?.data?.message;
    const isLogoutRequest = config?.url?.includes('/auth/logout');

    if (status === 401) {
      // Logout is always public — 401 means already cleared, do nothing
      if (isLogoutRequest) return Promise.reject(error);

      // INVALID_CREDENTIALS = login gagal, bukan sesi berakhir
      if (code === 'INVALID_CREDENTIALS') {
        return Promise.reject(error);
      }

      if (code === 'TOKEN_EXPIRED' || code === 'UNAUTHORIZED') {
        try {
          await pakaiAuthStore.getState().muatUser();
          return api.request(error.config);
        } catch {
          toast.error('Sesi kamu berakhir. Silakan masuk lagi.');
          pakaiAuthStore.getState().keluar();
        }
      } else {
        toast.error('Sesi kamu berakhir. Silakan masuk lagi.');
        pakaiAuthStore.getState().keluar();
      }
    } else if (status === 403) {
      toast.error('Kamu tidak punya akses ke resource ini.');
    } else if (status === 429) {
      toast.error('Terlalu banyak request. Tunggu sebentar.');
    } else if (status === 422 || status === 400) {
      toast.error(message ?? 'Data yang dikirim tidak valid.');
    } else if (status === 404) {
      // 404 biasanya normal untuk "tidak ditemukan", tidak perlu toast
    } else if (status === 500) {
      toast.error('Terjadi kesalahan pada server.');
    } else if (!error.response) {
      toast.error('Tidak bisa terhubung ke server. Periksa koneksi internet.');
    } else if (message && status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
