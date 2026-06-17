import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { menuAdmin } from '@/rute/menu';
import { Plus, Menu } from 'lucide-react';

interface LayoutDashboardProps {
  children: ReactNode;
  judulHalaman?: string;
  showTambah?: boolean;
  onTambah?: () => void;
  searchSlot?: ReactNode;
  actionsSlot?: ReactNode;
}

export const LayoutDashboard = ({ children, judulHalaman, showTambah, onTambah, searchSlot, actionsSlot }: LayoutDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-latar text-teks">
      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1">
        <Sidebar
          menu={menuAdmin}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex flex-1 flex-col min-w-0 lg:pl-60">
          {/* Topbar */}
          <nav className="sticky top-0 z-10 flex min-h-16 shrink-0 items-center border-b border-borderHalus bg-panel lg:h-16">
            <div className="flex w-full flex-wrap items-center gap-2 px-3 py-3 md:px-5 lg:flex-nowrap lg:gap-3 lg:py-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="btn-bounce flex h-9 w-9 items-center justify-center rounded-lg bg-section text-teks transition hover:bg-panelHover lg:hidden"
              >
                <Menu size={20} />
              </button>
              {judulHalaman && (
                <p className="brand-text font-semibold shrink-0">{judulHalaman}</p>
              )}
              {searchSlot && (
                <div className="order-last w-full flex-none lg:order-none lg:min-w-0 lg:flex-1">{searchSlot}</div>
              )}
              {showTambah && (
                <button
                  onClick={onTambah}
                  className="btn-bounce flex h-9 w-9 items-center justify-center rounded-full bg-utama text-black transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-utama/60 shrink-0"
                >
                  <Plus size={20} />
                </button>
              )}
              {actionsSlot && <div className="shrink-0">{actionsSlot}</div>}
            </div>
          </nav>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 md:px-5 md:py-5 md:space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
