import { PrismaClient } from '@prisma/client';

// ──────────────────────────────────────────────────────────
// Prisma Client Singleton
// ──────────────────────────────────────────────────────────
// Di development: log semua query
// Di production: silent
// ──────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['warn', 'error']
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
