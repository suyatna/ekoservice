import { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ClipboardText, CurrencyDollar, Package, X } from '@phosphor-icons/react';
import { pakaiAuthStore } from '@/store/auth';
import { bookingLayanan } from '@/layanan/booking';
import { transaksiLayanan } from '@/layanan/transaksi';

const iconMap: Record<string, JSX.Element> = {
  booking: <ClipboardText size={22} weight="fill" />,
  keuangan: <CurrencyDollar size={22} weight="fill" />,
  stok: <Package size={22} weight="fill" />
};

interface SidebarProps {
  menu: { label: string; to: string; icon: string }[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ menu, isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const keluar = pakaiAuthStore((s) => s.keluar);
  const teksStatStyle = { fontFamily: "'Farro', sans-serif", textTransform: 'none' as const };
  const rekapBooking = useQuery({
    queryKey: ['bookings', 'rekap-sidebar'],
    queryFn: () => bookingLayanan.daftar({ page: 1, limit: 100 }),
    staleTime: 30_000,
  });
  const rekapTransaksi = useQuery({
    queryKey: ['transaksi', 'rekap-sidebar'],
    queryFn: () => transaksiLayanan.daftar({ page: 1, limit: 100 }),
    staleTime: 30_000,
  });
  const bookingStatus = useMemo(() => {
    const counts = {
      menunggu: 0,
      servis: 0,
      selesai: 0,
    };

    rekapBooking.data?.data.forEach((item) => {
      if (item.status === 'SELESAI') counts.selesai += 1;
      else if (item.status === 'SERVIS') counts.servis += 1;
      else counts.menunggu += 1;
    });

    return [
      { label: 'Menunggu', total: counts.menunggu, color: 'bg-utama' },
      { label: 'Service', total: counts.servis, color: 'bg-[#D8B23A]' },
      { label: 'Selesai', total: counts.selesai, color: 'bg-[#2CBF78]' },
    ];
  }, [rekapBooking.data?.data]);

  const bookingTerbesar = Math.max(...bookingStatus.map((item) => item.total), 1);
  const transaksiBanding = useMemo(() => {
    const total = { masuk: 0, keluar: 0 };
    rekapTransaksi.data?.data.forEach((item) => {
      if (item.jenis === 'KELUAR') total.keluar += Number(item.nominal);
      else total.masuk += Number(item.nominal);
    });
    return total;
  }, [rekapTransaksi.data?.data]);
  const transaksiPembandingTerbesar = Math.max(transaksiBanding.masuk, transaksiBanding.keluar, 1);

  const handleLogout = () => {
    keluar();
    navigate('/');
  };

  const handleNavClick = (close: () => void) => {
    close();
  };

  const bukaMenu = (to: string) => {
    navigate(to);
    onClose?.();
  };

  const panelRekap = (
    <div className="mt-6 rounded-lg bg-latar p-3.5" style={teksStatStyle}>
      <div className="space-y-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => bukaMenu('/admin/booking')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') bukaMenu('/admin/booking');
          }}
          className="block w-full cursor-pointer py-2.5 text-left"
          style={teksStatStyle}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-redup">Booking</p>
          </div>
          <div className="mt-4 flex h-20 items-end gap-2.5">
            {bookingStatus.map((item) => (
              <span key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-0.5">
                <span
                  className={`w-full rounded-t-sm ${item.color}`}
                  style={{ height: `${Math.max((item.total / bookingTerbesar) * 100, 18)}%` }}
                />
              </span>
            ))}
          </div>
        <div className="mt-1 grid grid-cols-3 gap-1 text-[10px] text-redup">
          {bookingStatus.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </div>
        </div>
        <div className="h-px w-full bg-panel" />
        <div
          role="button"
          tabIndex={0}
          onClick={() => bukaMenu('/admin/keuangan')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') bukaMenu('/admin/keuangan');
          }}
          className="block w-full cursor-pointer py-2.5 text-left"
          style={teksStatStyle}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-redup">Transaksi</p>
          </div>
          <div className="mt-4 flex h-24 items-end gap-3 pb-1.5">
            <span className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span
                className="w-full rounded-t-sm bg-[#E35D6A]"
                style={{ height: `${Math.max((transaksiBanding.keluar / transaksiPembandingTerbesar) * 100, 18)}%` }}
              />
            </span>
            <span className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span
                className="w-full rounded-t-sm bg-[#2CBF78]"
                style={{ height: `${Math.max((transaksiBanding.masuk / transaksiPembandingTerbesar) * 100, 18)}%` }}
              />
            </span>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-2 text-[10px] text-redup">
            <span className="truncate">Pengeluaran</span>
            <span className="truncate">Pemasukan</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-20 h-full w-60 flex-col bg-panel border-r border-borderHalus">
        <nav className="flex-1 overflow-hidden px-3 pt-4">
          <div className="space-y-0.5">
            {menu.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${isActive ? 'bg-utama/10 text-utama border border-utama/30' : 'text-redup hover:bg-section/70 hover:text-teks2'}`
                }
              >
                {iconMap[m.icon] ?? <ClipboardText size={22} weight="fill" />}
                <span>{m.label}</span>
              </NavLink>
            ))}
          </div>
          {panelRekap}
        </nav>
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="btn-bounce btn-fill flex w-full items-center justify-center gap-2 rounded-[4px] border border-borderHalus bg-latar px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-utama/60"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile sidebar (slide-in) */}
      <aside className={`fixed left-0 top-0 z-30 h-full w-60 flex-col bg-panel border-r border-borderHalus transition-transform duration-200 ease-in-out lg:hidden ${isOpen ? 'flex' : 'hidden'}`}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="brand-text font-semibold text-sm">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-redup hover:bg-section transition"
          >
            <X size={22} weight="fill" />
          </button>
        </div>
        <nav className="flex-1 overflow-hidden px-3">
          <div className="space-y-0.5">
            {menu.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end
                onClick={() => handleNavClick(onClose!)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${isActive ? 'bg-utama/10 text-utama border border-utama/30' : 'text-redup hover:bg-section/70 hover:text-teks2'}`
                }
              >
                {iconMap[m.icon] ?? <ClipboardText size={22} weight="fill" />}
                <span>{m.label}</span>
              </NavLink>
            ))}
          </div>
          {panelRekap}
        </nav>
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="btn-bounce btn-fill flex w-full items-center justify-center gap-2 rounded-[4px] border border-borderHalus bg-latar px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-utama/60"
          >
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
};
