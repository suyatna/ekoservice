import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard } from '@/komponen/layout/LayoutDashboard';
import { FormSelect } from '@/komponen/form/FormSelect';
import { FormInput } from '@/komponen/form/FormInput';
import { Tombol } from '@/komponen/ui/tombol';
import { Search, Loader2, Plus } from 'lucide-react';
import { API_BASE_URL } from '@/layanan/api';
import { transaksiLayanan } from '@/layanan/transaksi';
import { tokenStorage } from '@/utils/token';
import { toast } from 'sonner';

type ExportRange = 'semua' | 'minggu' | 'bulan' | 'tahun';

function getDateRange(range: ExportRange) {
  const now = new Date();
  if (range === 'semua') {
    return { dari: '', sampai: '' };
  }
  if (range === 'minggu') {
    const s = new Date(now); s.setDate(now.getDate() - 7);
    return { dari: s.toISOString(), sampai: now.toISOString() };
  }
  if (range === 'bulan') {
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    return { dari: s.toISOString(), sampai: now.toISOString() };
  }
  const s = new Date(now.getFullYear(), 0, 1);
  return { dari: s.toISOString(), sampai: now.toISOString() };
}

interface FormState {
  deskripsi: string;
  jenis: 'MASUK' | 'KELUAR';
  nominal: string;
  tgl: string;
  touched?: boolean;
}

const kosongTransaksi = (): FormState => ({ deskripsi: '', jenis: 'MASUK', nominal: '', tgl: new Date().toISOString().split('T')[0], touched: false });

function rowSelesai(f: FormState) {
  return f.deskripsi.trim() !== '' && f.nominal.trim() !== '' && Number.isFinite(Number(f.nominal)) && Number(f.nominal) > 0 && f.tgl !== '' && !Number.isNaN(new Date(f.tgl).getTime());
}

export default function HalamanKeuangan() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [exportRange, setExportRange] = useState<ExportRange>('semua');
  const [barisBaru, setBarisBaru] = useState<FormState | null>(null);

  const dateRange = useMemo(() => getDateRange(exportRange), [exportRange]);
  const { dari, sampai } = dateRange;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['transaksi', { search, filterJenis, dari, sampai }],
    queryFn: () =>
      transaksiLayanan.daftar({ page: 1, limit: 100, search, jenis: filterJenis as any, dari: dari || undefined, sampai: sampai || undefined }),
    staleTime: 30_000,
    enabled: !!tokenStorage.getToken(),
    retry: 1,
  });

  const buatMutation = useMutation({
    mutationFn: (data: any) => transaksiLayanan.buat(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transaksi'] });
      setBarisBaru(null);
      toast.success('Transaksi dibuat');
    },
    onError: () => toast.error('Gagal buat transaksi'),
  });

  const hapusMutation = useMutation({
    mutationFn: (id: string) => transaksiLayanan.hapus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transaksi'] });
      toast.success('Transaksi dihapus');
    },
    onError: () => toast.error('Gagal hapus transaksi'),
  });

  const ubahMutation = useMutation({
    mutationFn: ({ id, data: d }: { id: string; data: any }) => transaksiLayanan.ubah(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transaksi'] });
      toast.success('Transaksi diupdate');
    },
    onError: () => toast.error('Gagal update transaksi'),
  });

  const transaksi = data?.data ?? [];

  const API_KEY = import.meta.env.VITE_API_KEY;

  const cobaBuatTransaksi = (next: FormState) => {
    if (!rowSelesai(next) || buatMutation.isPending) return;
    buatMutation.mutate({ deskripsi: next.deskripsi, jenis: next.jenis, nominal: Number(next.nominal), dibuatDi: new Date(next.tgl).toISOString() });
  };

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (filterJenis) params.append('jenis', filterJenis);
    if (dari) params.append('dari', dari);
    if (sampai) params.append('sampai', sampai);
    try {
      const res = await fetch(`${API_BASE_URL}/transaksi/export?${params}`, {
        headers: {
          Authorization: `Bearer ${tokenStorage.getToken()}`,
          'X-API-Key': API_KEY,
        },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-keuangan-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Gagal export PDF');
    }
  };

  return (
    <LayoutDashboard
      showTambah={false}
      actionsSlot={
        <div className="flex items-center gap-2">
          <Tombol
            onClick={handleExport}
            className="h-9 w-28 px-3 py-0 sm:w-36 sm:px-4"
          >
            Export PDF
          </Tombol>
          <button
            onClick={() => setBarisBaru(kosongTransaksi())}
            className="btn-bounce flex h-9 w-9 items-center justify-center rounded-full bg-utama text-black transition hover:brightness-105"
          >
            <Plus size={20} />
          </button>
        </div>
      }
      searchSlot={
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative w-full sm:flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-redup" />
            <input
              type="text"
              className="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-teks placeholder:text-redup rounded-lg border border-borderHalus focus:outline-none focus:border-utama/60"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FormSelect className="w-full sm:w-36" value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)}>
            <option value="">Semua</option>
            <option value="MASUK">Pemasukan</option>
            <option value="KELUAR">Pengeluaran</option>
          </FormSelect>
          <FormSelect className="w-full sm:w-36" value={exportRange} onChange={(e) => setExportRange(e.target.value as ExportRange)}>
            <option value="semua">Semua</option>
            <option value="minggu">Mingguan</option>
            <option value="bulan">Bulanan</option>
            <option value="tahun">Tahunan</option>
          </FormSelect>
        </div>
      }
    >
      <div className="kartu overflow-x-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} className="text-redup animate-spin" />
            <p className="text-sm text-redup">Memuat data transaksi...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-bahaya">Gagal memuat data transaksi</p>
          </div>
        ) : (
          <table className="min-w-[720px] text-sm table-fixed md:w-full">
            <colgroup>
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#2D2D2D]">
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Jenis Transaksi</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Detail</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Nominal (Rp)</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Tanggal Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {barisBaru && (
                <tr className="border-b border-[#2D2D2D] bg-utama/5">
                  <td className="px-3 py-2">
                    <FormSelect
                      value={barisBaru.jenis}
                      onChange={(e) => {
                        const next = { ...barisBaru, jenis: e.target.value as any, touched: true };
                        setBarisBaru(next);
                        cobaBuatTransaksi(next);
                      }}
                    >
                      <option value="MASUK">Masuk</option>
                      <option value="KELUAR">Keluar</option>
                    </FormSelect>
                  </td>
                  <td className="px-3 py-2">
                    <FormInput
                      value={barisBaru.deskripsi}
                      onChange={(e) => setBarisBaru({ ...barisBaru, deskripsi: e.target.value, touched: true })}
                      onBlur={(e) => {
                        const next = { ...barisBaru, deskripsi: e.target.value, touched: true };
                        setBarisBaru(next);
                        cobaBuatTransaksi(next);
                      }}
                      placeholder="Silahkan isi..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <FormInput
                      type="number"
                      value={barisBaru.nominal}
                      onChange={(e) => setBarisBaru({ ...barisBaru, nominal: e.target.value, touched: true })}
                      onBlur={(e) => {
                        const next = { ...barisBaru, nominal: e.target.value, touched: true };
                        setBarisBaru(next);
                        cobaBuatTransaksi(next);
                      }}
                      placeholder="Silahkan isi..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <FormInput
                      type="date"
                      value={barisBaru.tgl || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBarisBaru({ ...barisBaru, tgl: e.target.value, touched: true })}
                      onBlur={(e) => {
                        const next = { ...barisBaru, tgl: e.target.value, touched: true };
                        setBarisBaru(next);
                        cobaBuatTransaksi(next);
                      }}
                    />
                  </td>
                </tr>
              )}
              {transaksi.map((t) => (
                <TransaksiRow key={t.id} transaksi={t} ubahMutation={ubahMutation} hapusMutation={hapusMutation} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </LayoutDashboard>
  );
}

function TransaksiRow({ transaksi, ubahMutation, hapusMutation }: { transaksi: any; ubahMutation: any; hapusMutation: any }) {
  const [deskripsi, setDeskripsi] = useState(transaksi.deskripsi);
  const [jenis, setJenis] = useState(transaksi.jenis);
  const [nominal, setNominal] = useState(transaksi.nominal);
  const [tgl, setTgl] = useState(transaksi.dibuatDi ? new Date(transaksi.dibuatDi).toISOString().split('T')[0] : '');

  const simpan = (patch?: Partial<{ deskripsi: string; jenis: string; nominal: string; tgl: string }>) => {
    const nextDeskripsi = patch?.deskripsi ?? deskripsi;
    const nextJenis = patch?.jenis ?? jenis;
    const nextNominal = patch?.nominal ?? nominal;
    const nextTgl = patch?.tgl ?? tgl;

    // Jika salah satu field utama dikosongkan, hapus baris.
    if (nextDeskripsi.trim() === '' || nextNominal.trim() === '' || nextTgl === '') {
      hapusMutation.mutate(transaksi.id);
      return;
    }

    // Bangun object hanya dengan field yang terisi
    const data: Record<string, unknown> = {};
    if (nextDeskripsi.trim() !== '') data.deskripsi = nextDeskripsi;
    if (nextJenis !== '') data.jenis = nextJenis;
    if (nextNominal.trim() !== '') data.nominal = Number(nextNominal);
    if (nextTgl !== '') data.dibuatDi = new Date(nextTgl).toISOString();

    ubahMutation.mutate({ id: transaksi.id, data });
  };

  return (
    <tr className="border-b border-[#2D2D2D] hover:bg-[#161616] transition-colors">
      <td className="px-3 py-2">
        <FormSelect value={jenis} onChange={(e) => { const next = e.target.value; setJenis(next); simpan({ jenis: next }); }}>
          <option value="MASUK">Masuk</option>
          <option value="KELUAR">Keluar</option>
        </FormSelect>
      </td>
      <td className="px-3 py-2">
        <FormInput value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} onBlur={(e) => simpan({ deskripsi: e.target.value })} />
      </td>
      <td className="px-3 py-2">
        <FormInput
          type="number"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
          onBlur={(e) => simpan({ nominal: e.target.value })}
        />
      </td>
      <td className="px-3 py-2">
        <FormInput
          type="date"
          value={tgl}
          onChange={(e) => setTgl(e.target.value)}
          onBlur={(e) => simpan({ tgl: e.target.value })}
        />
      </td>
    </tr>
  );
}
