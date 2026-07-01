import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { authLayanan } from '@/layanan/auth';
import type { User } from '@/layanan/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  masuk: (username: string, password: string) => Promise<void>;
  keluar: () => Promise<void>;
  muatUser: () => Promise<void>;
}

export const pakaiAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      status: 'idle',

      masuk: async (username, password) => {
        set({ status: 'loading' });
        try {
          const { user } = await authLayanan.masuk({ username, password });
          set({ user, status: 'authenticated' });
          toast.success(`Selamat datang, ${user.nama}!`);
        } catch (err) {
          set({ status: 'unauthenticated' });
          throw err;
        }
      },

      keluar: async () => {
        try {
          await authLayanan.logout();
        } finally {
          set({ user: null, token: null, status: 'unauthenticated' });
          toast.info('Kamu sudah keluar');
        }
      },

      muatUser: async () => {
        try {
          const user = await authLayanan.me();
          set({ user, status: 'authenticated' });
        } catch {
          set({ user: null, token: null, status: 'unauthenticated' });
        }
      },
    }),
    {
      name: 'eko_auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.token) {
            state.status = 'authenticated';
          } else {
            state.status = 'unauthenticated';
          }
        }
      },
    }
  )
);
