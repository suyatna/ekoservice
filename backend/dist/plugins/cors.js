import cors from '@fastify/cors';
import { allowedOrigins, config } from '../config/index.js';
// ──────────────────────────────────────────────────────────
// CORS Configuration
// ──────────────────────────────────────────────────────────
// - Origin whitelist dari ALLOWED_ORIGINS
// - Credentials allowed (untuk httpOnly cookie)
// - Exposed headers untuk client bisa baca custom headers
// ──────────────────────────────────────────────────────────
export async function corsPlugin(fastify) {
    await fastify.register(cors, {
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-API-Key',
            'X-Request-ID',
            'X-Requested-With',
        ],
        exposedHeaders: [
            'X-Request-ID',
            'X-RateLimit-Limit',
            'X-RateLimit-Remaining',
            'X-RateLimit-Reset',
        ],
        maxAge: 86400, // 1 hari
    });
    if (config.NODE_ENV === 'development') {
        fastify.log.info(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
    }
}
//# sourceMappingURL=cors.js.map