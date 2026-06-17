import { StatusBooking } from '@/types';
import { warnaStatusBooking } from '@/konstanta/status';

export const BadgeStatus = ({ status }: { status: StatusBooking }) => {
  const warna = (warnaStatusBooking as Record<string, string>)[status] ?? 'bg-slate-600';
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${warna}`}>{status.replace(/_/g, ' ')}</span>;
};
