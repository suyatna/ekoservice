import { buildApp } from './app.js';
import { config } from './config/index.js';
import { prisma } from './shared/prisma.js';
// ──────────────────────────────────────────────────────────
// Server Entry Point
// ──────────────────────────────────────────────────────────
async function main() {
    // prisma.$connect() sudah dipanggil oleh prisma.ts saat import
    // Tunggu sampai koneksi benar-benar ready
    try {
        await prisma.$connect();
        console.log('✅ Database connected');
    }
    catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    }
    // Build & start server
    const app = await buildApp();
    try {
        await app.listen({
            port: config.PORT,
            host: '0.0.0.0',
        });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    for (const sig of signals) {
        process.on(sig, async () => {
            app.log.info(`Received ${sig}, shutting down gracefully...`);
            await app.close();
            await prisma.$disconnect();
            process.exit(0);
        });
    }
}
main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map