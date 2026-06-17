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

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Connection timeout — fail fast if DB is not ready
const CONNECT_TIMEOUT = 10_000;
const connectTimer = setTimeout(() => {
  console.error(`❌ Prisma connection timeout after ${CONNECT_TIMEOUT}ms — is the database running?`);
  process.exit(1);
}, CONNECT_TIMEOUT);

prisma.$connect()
  .then(() => clearTimeout(connectTimer))
  .catch((err) => {
    clearTimeout(connectTimer);
    console.error('❌ Prisma initial connect failed:', err.message);
    process.exit(1);
  });
