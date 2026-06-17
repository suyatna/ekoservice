import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { skemaMasuk } from '@/skema/auth';
import { z } from 'zod';
import { FormInput } from '@/komponen/form/FormInput';
import { Tombol } from '@/komponen/ui/tombol';
import { pakaiAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { ContainerPublik } from '@/komponen/layout/Container';

export const Masuk = () => {
  const nav = useNavigate();
  const { masuk, status } = pakaiAuthStore();
  const [lihatPassword, setLihatPassword] = useState(false);
  const {
    register,
    handleSubmit
  } = useForm<z.infer<typeof skemaMasuk>>({
    resolver: zodResolver(skemaMasuk)
  });

  const onSubmit = handleSubmit(async (v) => {
    try {
      await masuk(v.email, v.password);
      nav('/admin/booking');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login gagal');
    }
  });

  return (
    <div className="h-screen bg-latar text-teks overflow-hidden">
      <ContainerPublik className="flex h-full flex-col">
        <div className="pt-8">
          <button
            type="button"
            onClick={() => nav('/')}
            className="inline-flex items-center gap-2 text-sm text-redup hover:text-teks"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md px-4 sm:px-0">
            <h2 className="mb-4 text-center text-xl font-semibold">
              Login Admin
            </h2>
            <div className="kartu rounded-none space-y-4 p-6 md:p-8 text-center">
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-redup"
                    />
                    <FormInput
                      type="email"
                      placeholder="Email"
                      className="pl-10 pr-10"
                      {...register('email')}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-redup"
                    />
                    <FormInput
                      type={lihatPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="pl-10 pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setLihatPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-redup hover:text-teks p-1"
                      aria-label={
                        lihatPassword ? 'Sembunyikan password' : 'Lihat password'
                      }
                    >
                      {lihatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="pt-6">
                  <Tombol
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-bounce w-full"
                  >
                    {status === 'loading' ? 'Memproses...' : 'Masuk'}
                  </Tombol>
                </div>
              </form>
            </div>
          </div>
        </div>
      </ContainerPublik>
    </div>
  );
};
