import { FormInput } from '@/komponen/form/FormInput';
import { FormSelect } from '@/komponen/form/FormSelect';

export const FilterBar = () => (
  <div className="kartu mb-3 grid gap-2 p-3 md:grid-cols-3">
    <FormInput placeholder="Cari data..." className="h-9" />
    <FormSelect className="h-9"><option>Semua Status</option><option>Aktif</option><option>Selesai</option></FormSelect>
    <FormSelect className="h-9"><option>Urutkan Terbaru</option><option>Urutkan Lama</option></FormSelect>
  </div>
);
