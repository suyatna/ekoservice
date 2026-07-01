import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const GrafikRingkasan = ({ data }: { data: { nama: string; nilai: number }[] }) => (
  <div className="kartu p-3">
    <p className="mb-2 text-sm font-semibold">Ringkasan Booking</p>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="nama" stroke="#8D9AA0" fontSize={11} />
          <YAxis stroke="#8D9AA0" fontSize={11} />
          <Tooltip contentStyle={{ background: '#1D2527', border: '1px solid #2A3639' }} />
          <Bar dataKey="nilai" fill="#3678F4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
