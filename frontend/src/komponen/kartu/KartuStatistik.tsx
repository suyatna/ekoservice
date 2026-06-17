export const KartuStatistik = ({ label, nilai, sub }: { label: string; nilai: string; sub?: string }) => (
  <div className="kartu p-3">
    <p className="text-xs uppercase tracking-wide text-redup">{label}</p>
    <p className="mt-1 text-xl font-semibold">{nilai}</p>
    {sub ? <p className="mt-1 text-xs text-utama">{sub}</p> : null}
  </div>
);
