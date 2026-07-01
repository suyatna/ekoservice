import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard } from '@/komponen/layout/LayoutDashboard';
import { FormSelect } from '@/komponen/form/FormSelect';
import { FormInput } from '@/komponen/form/FormInput';
import { CircleNotch, MagnifyingGlass } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { sparepartLayanan } from '@/layanan/sparepart';
import { pesanErrorApi } from '@/layanan/api';
import { kategoriSparepartOptions } from '@/skema/sparepart';

interface FormState {
  nama: string;
  kategori: string;
  stok: string;
  satuan: string;
  touched?: boolean;
}

const kosongSparepart = (): FormState => ({
  nama: '', kategori: 'AC', stok: '', satuan: 'pcs', touched: false,
});

function rowSelesai(f: FormState) {
  const stok = Number(f.stok);
  return f.nama.trim() !== '' && f.stok.trim() !== '' && Number.isFinite(stok) && stok >= 0 && f.satuan.trim() !== '';
}

export default function HalamanStok() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [barisBaru, setBarisBaru] = useState<FormState | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sparepart', { search, filterKategori }],
    queryFn: () => sparepartLayanan.daftar({ page: 1, limit: 100, search, kategori: filterKategori }),
    staleTime: 30_000,
  });

  const buatMutation = useMutation({
    mutationFn: (data: any) => sparepartLayanan.buat(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sparepart'] });
      setBarisBaru(null);
      toast.success('Sparepart dibuat');
    },
    onError: (err) => toast.error(pesanErrorApi(err, 'Gagal buat sparepart')),
  });

  const hapusMutation = useMutation({
    mutationFn: (id: string) => sparepartLayanan.hapus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sparepart'] });
      toast.success('Sparepart dihapus');
    },
    onError: (err) => toast.error(pesanErrorApi(err, 'Gagal hapus sparepart')),
  });

  const ubahMutation = useMutation({
    mutationFn: ({ id, data: d }: { id: string; data: any }) => sparepartLayanan.ubah(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sparepart'] });
      toast.success('Sparepart diupdate');
    },
    onError: (err) => toast.error(pesanErrorApi(err, 'Gagal update sparepart')),
  });

  const spareparts = data?.data ?? [];

  const cobaBuatSparepart = (next: FormState) => {
    if (!rowSelesai(next) || buatMutation.isPending) return;
    buatMutation.mutate({
      nama: next.nama,
      kategori: next.kategori as any,
      stok: Number(next.stok),
      satuan: next.satuan,
    });
  };

  return (
    <LayoutDashboard
      showTambah
      tambahAktif={!!barisBaru}
      onTambah={() => setBarisBaru((prev) => (prev ? null : kosongSparepart()))}
      searchSlot={
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative w-full sm:flex-1">
            <MagnifyingGlass size={22} weight="fill" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-redup" />
            <input
              type="text"
              className="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-teks placeholder:text-redup rounded-lg border border-borderHalus focus:outline-none focus:border-utama/60"
              placeholder="Cari sparepart..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FormSelect className="w-full sm:w-36" value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}>
            <option value="">Semua</option>
            {Object.entries(kategoriSparepartOptions).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </FormSelect>
        </div>
      }
    >
      <div className="kartu w-full overflow-x-auto overscroll-x-contain pb-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CircleNotch size={22} weight="fill" className="text-redup animate-spin" />
            <p className="text-sm text-redup">Memuat data...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-bahaya">{pesanErrorApi(error, 'Gagal memuat data')}</p>
          </div>
        ) : (
          <table className="min-w-[680px] text-sm table-fixed md:w-full">
            <colgroup>
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#2A3639]">
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-white">Nama Sparepart</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-white">Kategori</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-white">Jumlah Stok</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-white">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {barisBaru && (
                <tr className="border-b border-[#2A3639] bg-utama/5">
                  <td className="px-3 py-2">
                    <FormInput
                      value={barisBaru.nama}
                      error={barisBaru.touched && barisBaru.nama.trim() === '' ? 'Nama wajib diisi' : undefined}
                      onChange={(e) => setBarisBaru({ ...barisBaru, nama: e.target.value, touched: true })}
                      onBlur={(e) => {
                        const next = { ...barisBaru, nama: e.target.value, touched: true };
                        setBarisBaru(next);
                        cobaBuatSparepart(next);
                      }}
                      placeholder="Silahkan isi..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <FormSelect
                      value={barisBaru.kategori}
                      onChange={(e) => {
                        const next = { ...barisBaru, kategori: e.target.value, touched: true };
                        setBarisBaru(next);
                      }}
                    >
                      {Object.entries(kategoriSparepartOptions).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </FormSelect>
                  </td>
                  <td className="px-3 py-2">
                    <FormInput
                      type="number"
                      value={barisBaru.stok}
                      error={barisBaru.touched && !Number.isFinite(Number(barisBaru.stok)) ? 'Stok wajib angka' : undefined}
                      onChange={(e) => setBarisBaru({ ...barisBaru, stok: e.target.value, touched: true })}
                      onBlur={(e) => {
                        const next = { ...barisBaru, stok: e.target.value, touched: true };
                        setBarisBaru(next);
                        cobaBuatSparepart(next);
                      }}
                      placeholder="Silahkan isi..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <FormInput
                      value={barisBaru.satuan}
                      error={barisBaru.touched && barisBaru.satuan.trim() === '' ? 'Satuan wajib diisi' : undefined}
                      onChange={(e) => setBarisBaru({ ...barisBaru, satuan: e.target.value, touched: true })}
                      onBlur={(e) => {
                        const next = { ...barisBaru, satuan: e.target.value, touched: true };
                        setBarisBaru(next);
                        cobaBuatSparepart(next);
                      }}
                      placeholder="Silahkan isi..."
                    />
                  </td>
                </tr>
              )}
              {spareparts.length === 0 && !barisBaru && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <p className="text-sm text-teks2" style={{ fontFamily: "'Farro', sans-serif", textTransform: 'none' }}>
                      Data tidak tersedia
                    </p>
                  </td>
                </tr>
              )}
              {spareparts.map((s) => (
                <SparepartRow key={s.id} sparepart={s} ubahMutation={ubahMutation} hapusMutation={hapusMutation} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </LayoutDashboard>
  );
}

function SparepartRow({ sparepart, ubahMutation, hapusMutation }: { sparepart: any; ubahMutation: any; hapusMutation: any }) {
  const [nama, setNama] = useState(sparepart.nama);
  const [kategori, setKategori] = useState(sparepart.kategori);
  const [stok, setStok] = useState(String(sparepart.stok));
  const [satuan, setSatuan] = useState(sparepart.satuan);

  const simpan = (patch?: Partial<{ nama: string; kategori: string; stok: string; satuan: string }>) => {
    const nextNama = patch?.nama ?? nama;
    const nextKategori = patch?.kategori ?? kategori;
    const nextStok = patch?.stok ?? stok;
    const nextSatuan = patch?.satuan ?? satuan;

    // Jika salah satu field utama dikosongkan, hapus baris.
    if (nextNama.trim() === '' || nextStok.trim() === '' || nextSatuan.trim() === '') {
      hapusMutation.mutate(sparepart.id);
      return;
    }
    if (!Number.isFinite(Number(nextStok)) || Number(nextStok) < 0) {
      toast.error('Jumlah stok harus angka 0 atau lebih');
      return;
    }

    // Bangun object hanya dengan field yang terisi
    const data: Record<string, unknown> = {};
    if (nextNama.trim() !== '') data.nama = nextNama;
    if (nextKategori !== '') data.kategori = nextKategori;
    if (nextStok.trim() !== '') data.stok = Number(nextStok);
    if (nextSatuan.trim() !== '') data.satuan = nextSatuan;

    ubahMutation.mutate({ id: sparepart.id, data });
  };

  return (
    <tr className="border-b border-[#2A3639] hover:bg-panelHover transition-colors">
      <td className="px-3 py-2">
        <FormInput value={nama} onChange={(e) => setNama(e.target.value)} onBlur={(e) => simpan({ nama: e.target.value })} />
      </td>
      <td className="px-3 py-2">
        <FormSelect value={kategori} onChange={(e) => { const next = e.target.value; setKategori(next); simpan({ kategori: next }); }}>
          {Object.entries(kategoriSparepartOptions).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </FormSelect>
      </td>
      <td className="px-3 py-2">
        <FormInput
          type="number"
          value={stok}
          onChange={(e) => setStok(e.target.value)}
          onBlur={(e) => simpan({ stok: e.target.value })}
        />
      </td>
      <td className="px-3 py-2">
        <FormInput value={satuan} onChange={(e) => setSatuan(e.target.value)} onBlur={(e) => simpan({ satuan: e.target.value })} />
      </td>
    </tr>
  );
}
