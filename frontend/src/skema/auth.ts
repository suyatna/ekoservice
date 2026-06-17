import { z } from 'zod';

export const skemaMasuk = z.object({ email: z.string().email('Format email tidak valid'), password: z.string().min(8, 'Password minimal 8 karakter') });
