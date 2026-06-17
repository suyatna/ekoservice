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
          <nav className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b border-borderHalus bg-panel">
            <div className="flex items-center gap-3 w-full px-4 md:px-5">
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
                <div className="flex-1 min-w-0">{searchSlot}</div>
              )}
              {showTambah && (
                <button
                  onClick={onTambah}
                  className="btn-bounce flex h-9 w-9 items-center justify-center rounded-full bg-utama text-black transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-utama/60 shrink-0"
                >
                  <Plus size={20} />
                </button>
              )}
              {actionsSlot}
            </div>
          </nav>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 md:px-5 md:py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};