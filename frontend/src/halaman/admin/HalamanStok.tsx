import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard } from '@/komponen/layout/LayoutDashboard';
import { FormSelect } from '@/komponen/form/FormSelect';
import { FormInput } from '@/komponen/form/FormInput';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { sparepartLayanan } from '@/layanan/sparepart';
import { kategoriSparepartOptions } from '@/skema/sparepart';

interface FormState {
  nama: string;
  kategori: string;
  stok: string;
  satuan: string;
}

const kosongSparepart = (): FormState => ({
  nama: '', kategori: 'AC', stok: '', satuan: 'pcs',
});

function rowSelesai(f: FormState) {
  return f.nama.trim() !== '' && f.stok.trim() !== '' && f.satuan.trim() !== '';
}

function rowKosong(f: FormState) {
  return f.nama.trim() === '' && f.stok.trim() === '' && f.satuan.trim() === '';
}

export default function HalamanStok() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [barisBaru, setBarisBaru] = useState<FormState | null>(null);

  const { data, isLoading, isError } = useQuery({
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
    onError: () => toast.error('Gagal buat sparepart'),
  });

  const hapusMutation = useMutation({
    mutationFn: (id: string) => sparepartLayanan.hapus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sparepart'] });
      toast.success('Sparepart dihapus');
    },
    onError: () => toast.error('Gagal hapus sparepart'),
  });

  // Auto-save: buat row baru ke backend saat semua field terisi
  useEffect(() => {
    if (!barisBaru || !rowSelesai(barisBaru) || buatMutation.isPending) return;
    buatMutation.mutate({
      nama: barisBaru.nama,
      kategori: barisBaru.kategori as any,
      stok: Number(barisBaru.stok),
      satuan: barisBaru.satuan,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barisBaru]);

  // Auto-clear draft: jika user kosongkan semua field, kosongkan state (row belum di-save)
  useEffect(() => {
    if (!barisBaru || !rowKosong(barisBaru) || buatMutation.isPending) return;
    setBarisBaru(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barisBaru]);

  const ubahMutation = useMutation({
    mutationFn: ({ id, data: d }: { id: string; data: any }) => sparepartLayanan.ubah(id, d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sparepart'] }),
    onError: () => toast.error('Gagal update sparepart'),
  });

  const spareparts = data?.data ?? [];

  return (
    <LayoutDashboard
      showTambah
      onTambah={() => setBarisBaru(kosongSparepart())}
      searchSlot={
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-redup" />
            <input
              type="text"
              className="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-teks placeholder:text-redup rounded-lg border border-borderHalus focus:outline-none focus:border-utama/60"
              placeholder="Cari sparepart..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FormSelect className="w-36" value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}>
            <option value="">Semua</option>
            {Object.entries(kategoriSparepartOptions).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </FormSelect>
        </div>
      }
    >
      <div className="kartu overflow-x-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} className="text-redup animate-spin" />
            <p className="text-sm text-redup">Memuat data sparepart...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-bahaya">Gagal memuat data sparepart</p>
          </div>
        ) : (
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#2D2D2D]">
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Nama</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Kategori</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Stok</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {barisBaru && (
                <tr className="border-b border-[#2D2D2D] bg-utama/5">
                  <td className="px-3 py-2">
                    <FormInput
                      value={barisBaru.nama}
                      onChange={(e) => setBarisBaru({ ...barisBaru, nama: e.target.value })}
                      placeholder="Silahkan isi..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <FormSelect value={barisBaru.kategori} onChange={(e) => setBarisBaru({ ...barisBaru, kategori: e.target.value })}>
                      {Object.entries(kategoriSparepartOptions).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </FormSelect>
                  </td>
                  <td className="px-3 py-2">
                    <FormInput
                      type="number"
                      value={barisBaru.stok}
                      onChange={(e) => setBarisBaru({ ...barisBaru, stok: e.target.value })}
                      placeholder="Silahkan isi..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <FormInput
                      value={barisBaru.satuan}
                      onChange={(e) => setBarisBaru({ ...barisBaru, satuan: e.target.value })}
                      placeholder="Silahkan isi..."
                    />
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

    // Jika semua field kosong → hapus
    if (nextNama.trim() === '' && nextStok.trim() === '' && nextSatuan.trim() === '') {
      hapusMutation.mutate(sparepart.id);
      return;
    }

    // Bangun object hanya dengan field yang terisi
    const data: Record<string, unknown> = {};
    if (nextNama.trim() !== '') data.nama = nextNama;
    if (nextKategori !== '') data.kategori = nextKategori;
    if (nextStok.trim() !== '') data.stok = Number(nextStok);
    if (nextSatuan.trim() !== '') data.satuan = nextSatuan;

    // Jika tidak ada field yang terisi → hapus
    if (Object.keys(data).length === 0) {
      hapusMutation.mutate(sparepart.id);
      return;
    }

    ubahMutation.mutate({ id: sparepart.id, data });
  };

  return (
    <tr className="border-b border-[#2D2D2D] hover:bg-[#161616] transition-colors">
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
