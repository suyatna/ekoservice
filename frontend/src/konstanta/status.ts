import { StatusBooking } from '@/types';

export const warnaStatusBooking: Record<StatusBooking, string> = {
  MENUNGGU: 'bg-peringatan',
  SERVIS: 'bg-aksen',
  SELESAI: 'bg-sukses',
  DIBATALKAN: 'bg-bahaya',
};
