import { useMemo, useState } from 'react';

export const TabelData = ({ kolom, baris, perHalaman = 5 }: { kolom: string[]; baris: string[][]; perHalaman?: number }) => {
  const [halaman, setHalaman] = useState(1);
  const totalHalaman = Math.max(1, Math.ceil(baris.length / perHalaman));

  const dataAktif = useMemo(() => {
    const mulai = (halaman - 1) * perHalaman;
    return baris.slice(mulai, mulai + perHalaman);
  }, [baris, halaman, perHalaman]);

  return (
    <div className="kartu overflow-auto p-3">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {kolom.map((k) => (
              <th key={k} className="border-b border-borderHalus px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-redup">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataAktif.map((b, i) => (
            <tr key={i} className="border-b border-borderHalus/80 last:border-b-0 hover:bg-panel/40">
              {b.map((c, ix) => (
                <td key={ix} className="px-2 py-2 text-sm">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-borderHalus pt-2 text-xs text-redup">
        <p>
          Menampilkan {(halaman - 1) * perHalaman + 1} - {Math.min(halaman * perHalaman, baris.length)} dari {baris.length} data
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHalaman((h) => Math.max(1, h - 1))}
            disabled={halaman === 1}
            className="rounded-md border border-borderHalus px-2 py-1 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="rounded-md border border-borderHalus px-2 py-1 text-teks2">
            {halaman} / {totalHalaman}
          </span>
          <button
            onClick={() => setHalaman((h) => Math.min(totalHalaman, h + 1))}
            disabled={halaman === totalHalaman}
            className="rounded-md border border-borderHalus px-2 py-1 disabled:opacity-50"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};
