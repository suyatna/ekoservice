import { Suspense, lazy, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PenjagaAuth, PenjagaAdmin } from './penjaga';
import type { Role } from '@/types';

const Landing = lazy(() => import('@/halaman/publik/Landing').then((m) => ({ default: m.Landing })));
const BookingPublik = lazy(() => import('@/halaman/publik/BookingPublik').then((m) => ({ default: m.default })));
const Masuk = lazy(() => import('@/halaman/auth/Masuk').then((m) => ({ default: m.Masuk })));

const HalamanBooking = lazy(() => import('@/halaman/admin').then((m) => ({ default: m.HalamanBooking })));
const HalamanKeuangan = lazy(() => import('@/halaman/admin').then((m) => ({ default: m.HalamanKeuangan })));
const HalamanStok = lazy(() => import('@/halaman/admin').then((m) => ({ default: m.HalamanStok })));

const bungkusLazy = (node: ReactNode) => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center bg-latar text-sm text-redup">Memuat...</div>}>
    {node}
  </Suspense>
);

export const router = createBrowserRouter([
  { path: '/', element: bungkusLazy(<Landing />) },
  { path: '/booking', element: bungkusLazy(<BookingPublik />) },
  { path: '/masuk', element: bungkusLazy(<Masuk />) },
  {
    element: <PenjagaAuth />,
    children: [
      {
        element: <PenjagaAdmin roles={['ADMIN_OPERASIONAL'] as Role[]} />,
        children: [{ path: '/admin/booking', element: bungkusLazy(<HalamanBooking />) }]
      },
      {
        element: <PenjagaAdmin roles={['FINANCE'] as Role[]} />,
        children: [{ path: '/admin/keuangan', element: bungkusLazy(<HalamanKeuangan />) }]
      },
      {
        element: <PenjagaAdmin roles={['WAREHOUSE'] as Role[]} />,
        children: [{ path: '/admin/stok', element: bungkusLazy(<HalamanStok />) }]
      }
    ]
  }
]);
