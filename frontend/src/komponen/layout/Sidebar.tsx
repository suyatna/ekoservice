import { NavLink, useNavigate } from 'react-router-dom';
import { ClipboardList, DollarSign, Package, X } from 'lucide-react';
import { pakaiAuthStore } from '@/store/auth';

const iconMap: Record<string, JSX.Element> = {
  booking: <ClipboardList size={20} />,
  keuangan: <DollarSign size={20} />,
  stok: <Package size={20} />
};

interface SidebarProps {
  menu: { label: string; to: string; icon: string }[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ menu, isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const keluar = pakaiAuthStore((s) => s.keluar);

  const handleLogout = () => {
    keluar();
    navigate('/');
  };

  const handleNavClick = (close: () => void) => {
    close();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-20 h-full w-60 flex-col bg-panel border-r border-borderHalus">
        <nav className="flex-1 overflow-y-auto px-3 pt-4 space-y-0.5">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${isActive ? 'bg-utama/10 text-utama border border-utama/30' : 'text-redup hover:bg-section/70 hover:text-teks2'}`
              }
            >
              {iconMap[m.icon] ?? <ClipboardList size={20} />}
              <span>{m.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="btn-bounce flex w-full items-center justify-center gap-2 rounded-full border border-borderHalus bg-latar px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-utama/60"
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
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
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
              {iconMap[m.icon] ?? <ClipboardList size={20} />}
              <span>{m.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="btn-bounce flex w-full items-center justify-center gap-2 rounded-full border border-borderHalus bg-latar px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-utama/60"
          >
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
};