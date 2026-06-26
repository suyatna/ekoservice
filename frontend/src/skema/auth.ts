import { z } from 'zod';

export const skemaMasuk = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').max(50, 'Username maksimal 50 karakter').trim(),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});
