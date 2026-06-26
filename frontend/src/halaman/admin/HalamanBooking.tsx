import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard } from '@/komponen/layout/LayoutDashboard';
import { FormSelect } from '@/komponen/form/FormSelect';
import { FormInput } from '@/komponen/form/FormInput';
import { Search, Loader2 } from 'lucide-react';
import { bookingLayanan } from '@/layanan/booking';
import { kategoriOptions, statusGroupConfig } from '@/skema/booking';
import { toast } from 'sonner';

const ALL_KATEGORI = Object.keys(kategoriOptions);
const STATUS_GROUPS = Object.keys(statusGroupConfig);
const AUTO_SAVE_DELAY_MS = 700;

function getGroupKey(bookingStatus: string): string {
  for (const [key, group] of Object.entries(statusGroupConfig)) {
    if (group.statuses.includes(bookingStatus)) return key;
  }
  return 'MENUNGGU';
}

function getGroupLabel(key: string): string {
  return statusGroupConfig[key]?.label ?? key;
}

interface FormState {
  nama: string;
  kategori: string;
  tglBooking: string;
  noTelp: string;
  status: string;
  touched?: boolean;
}

const kosongBooking = (): FormState => ({
  nama: '', kategori: 'SERVICE_AC', tglBooking: '', noTelp: '', status: 'MENUNGGU', touched: false,
});

function rowSelesai(f: FormState) {
  return f.nama.trim() !== '' && f.tglBooking !== '' && f.noTelp.trim() !== '';
}

function rowKosong(f: FormState) {
  return f.nama.trim() === '' && f.tglBooking === '' && f.noTelp.trim() === '';
}

function rowBatal(f: FormState) {
  return f.touched && rowKosong(f);
}

export default function HalamanBooking() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [barisBaru, setBarisBaru] = useState<FormState | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookings', { search, filterStatus, filterKategori }],
    queryFn: () => {
      if (filterStatus && statusGroupConfig[filterStatus]) {
        return bookingLayanan.daftar({
          page: 1, limit: 100, search,
          status: statusGroupConfig[filterStatus].statuses[0],
          kategori: filterKategori,
        });
      }
      return bookingLayanan.daftar({ page: 1, limit: 100, search, status: filterStatus, kategori: filterKategori });
    },
    staleTime: 30_000,
  });

  const buatMutation = useMutation({
    mutationFn: (data: any) => bookingLayanan.buat(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      setBarisBaru(null);
      toast.success('Booking dibuat');
    },
    onError: () => toast.error('Gagal buat booking'),
  });

  const hapusMutation = useMutation({
    mutationFn: (id: string) => bookingLayanan.hapus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking dihapus');
    },
    onError: () => toast.error('Gagal hapus booking'),
  });

  // Auto-save: buat row baru ke backend saat semua field terisi
  useEffect(() => {
    if (!barisBaru || !rowSelesai(barisBaru) || buatMutation.isPending) return;
    const timer = window.setTimeout(() => {
      const firstStatus = statusGroupConfig[barisBaru.status]?.statuses[0];
      buatMutation.mutate({
        namaPelanggan: barisBaru.nama,
        kategori: barisBaru.kategori,
        tglBooking: new Date(barisBaru.tglBooking).toISOString(),
        noTelpPelanggan: barisBaru.noTelp,
        status: firstStatus,
      });
    }, AUTO_SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barisBaru]);

  // Auto-clear draft: row sudah disentuh tapi dikosongkan → hapus
  useEffect(() => {
    if (!barisBaru || !rowBatal(barisBaru) || buatMutation.isPending) return;
    setBarisBaru(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barisBaru]);

  const ubahMutation = useMutation({
    mutationFn: ({ id, data: d }: { id: string; data: any }) => bookingLayanan.ubah(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking diupdate');
    },
    onError: () => toast.error('Gagal update booking'),
  });

  let bookings = data?.data ?? [];
  if (filterStatus && statusGroupConfig[filterStatus]) {
    const groupStatuses = statusGroupConfig[filterStatus].statuses;
    bookings = bookings.filter((b: any) => groupStatuses.includes(b.status));
  }

  return (
    <LayoutDashboard
      showTambah
      onTambah={() => setBarisBaru(kosongBooking())}
      searchSlot={
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative w-full sm:flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-redup" />
            <input
              type="text"
              className="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-teks placeholder:text-redup rounded-lg border border-borderHalus focus:outline-none focus:border-utama/60"
              placeholder="Cari nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FormSelect className="w-full sm:w-36" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Semua</option>
            {STATUS_GROUPS.map((g) => (
              <option key={g} value={g}>{getGroupLabel(g)}</option>
            ))}
          </FormSelect>
          <FormSelect className="w-full sm:w-36" value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}>
            <option value="">Semua</option>
            {ALL_KATEGORI.map((k) => (
              <option key={k} value={k}>{kategoriOptions[k]}</option>
            ))}
          </FormSelect>
        </div>
      }
    >
      <div className="kartu overflow-x-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} className="text-redup animate-spin" />
            <p className="text-sm text-redup">Memuat data booking...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-bahaya">Gagal memuat data booking</p>
            <button onClick={() => qc.invalidateQueries({ queryKey: ['bookings'] })} className="mt-2 text-xs text-utama hover:underline">Coba lagi</button>
          </div>
        ) : bookings.length === 0 && !barisBaru ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-teks2">Tidak ada booking ditemukan</p>
          </div>
        ) : (
          <table className="min-w-[760px] text-sm table-fixed md:w-full">
            <colgroup>
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#2D2D2D]">
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Pelanggan</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Service</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Tanggal Booking</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">No. WhatsApp</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase bg-utama text-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {barisBaru && (
                <tr className="border-b border-[#2D2D2D] bg-utama/5">
                  <td className="px-3 py-2">
                    <FormInput
                      value={barisBaru.nama}
                      onChange={(e) => setBarisBaru({ ...barisBaru, nama: e.target.value, touched: true })}
                      placeholder="Silahkan isi..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <FormSelect value={barisBaru.kategori} onChange={(e) => setBarisBaru({ ...barisBaru, kategori: e.target.value, touched: true })}>
                      {ALL_KATEGORI.map((k) => (
                        <option key={k} value={k}>{kategoriOptions[k]}</option>
                      ))}
                    </FormSelect>
                  </td>
                  <td className="px-3 py-2">
                    <FormInput type="date" value={barisBaru.tglBooking} onChange={(e) => setBarisBaru({ ...barisBaru, tglBooking: e.target.value, touched: true })} />
                  </td>
                  <td className="px-3 py-2">
                    <FormInput
                      value={barisBaru.noTelp}
                      onChange={(e) => setBarisBaru({ ...barisBaru, noTelp: e.target.value, touched: true })}
                      placeholder="Silahkan isi..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <FormSelect value={barisBaru.status} onChange={(e) => setBarisBaru({ ...barisBaru, status: e.target.value, touched: true })}>
                      {STATUS_GROUPS.map((g) => (
                        <option key={g} value={g}>{getGroupLabel(g)}</option>
                      ))}
                    </FormSelect>
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <BookingRow key={b.id} booking={b} ubahMutation={ubahMutation} hapusMutation={hapusMutation} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </LayoutDashboard>
  );
}

function BookingRow({ booking, ubahMutation, hapusMutation }: { booking: any; ubahMutation: any; hapusMutation: any }) {
  const [nama, setNama] = useState(booking.namaPelanggan);
  const [kategori, setKategori] = useState(booking.kategori);
  const [tglBooking, setTglBooking] = useState(
    booking.tglBooking ? new Date(booking.tglBooking).toISOString().split('T')[0] : ''
  );
  const [noTelp, setNoTelp] = useState(booking.noTelpPelanggan);
  const [statusGroup, setStatusGroup] = useState(getGroupKey(booking.status));

  const simpan = (patch?: Partial<{ nama: string; kategori: string; tglBooking: string; noTelp: string; statusGroup: string }>) => {
    const nextNama = patch?.nama ?? nama;
    const nextKategori = patch?.kategori ?? kategori;
    const nextTglBooking = patch?.tglBooking ?? tglBooking;
    const nextNoTelp = patch?.noTelp ?? noTelp;
    const nextStatusGroup = patch?.statusGroup ?? statusGroup;

    // Jika salah satu field utama dikosongkan, hapus baris.
    if (nextNama.trim() === '' || nextTglBooking === '' || nextNoTelp.trim() === '') {
      hapusMutation.mutate(booking.id);
      return;
    }

    // Bangun object hanya dengan field yang terisi
    const data: Record<string, unknown> = {};
    if (nextNama.trim() !== '') data.namaPelanggan = nextNama;
    if (nextKategori !== '') data.kategori = nextKategori;
    if (nextTglBooking !== '') data.tglBooking = new Date(nextTglBooking).toISOString();
    if (nextNoTelp.trim() !== '') data.noTelpPelanggan = nextNoTelp;
    if (nextStatusGroup !== '') {
      const firstStatus = statusGroupConfig[nextStatusGroup]?.statuses[0];
      if (firstStatus) data.status = firstStatus;
    }

    ubahMutation.mutate({ id: booking.id, data });
  };

  return (
    <tr className="border-b border-[#2D2D2D] hover:bg-[#161616] transition-colors">
      <td className="px-3 py-2">
        <FormInput value={nama} onChange={(e) => setNama(e.target.value)} onBlur={(e) => simpan({ nama: e.target.value })} />
      </td>
      <td className="px-3 py-2">
        <FormSelect value={kategori} onChange={(e) => { const next = e.target.value; setKategori(next); simpan({ kategori: next }); }}>
          {ALL_KATEGORI.map((k) => (
            <option key={k} value={k}>{kategoriOptions[k]}</option>
          ))}
        </FormSelect>
      </td>
      <td className="px-3 py-2">
        <FormInput type="date" value={tglBooking} onChange={(e) => setTglBooking(e.target.value)} onBlur={(e) => simpan({ tglBooking: e.target.value })} />
      </td>
      <td className="px-3 py-2">
        <FormInput value={noTelp} onChange={(e) => setNoTelp(e.target.value)} onBlur={(e) => simpan({ noTelp: e.target.value })} />
      </td>
      <td className="px-3 py-2">
        <FormSelect value={statusGroup} onChange={(e) => { const next = e.target.value; setStatusGroup(next); simpan({ statusGroup: next }); }}>
          {STATUS_GROUPS.map((g) => (
            <option key={g} value={g}>{getGroupLabel(g)}</option>
          ))}
        </FormSelect>
      </td>
    </tr>
  );
}
