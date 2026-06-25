import 'dotenv/config';
import { z } from 'zod';
// ──────────────────────────────────────────────────────────
// Environment Schema (Zod validated)
// Jika ada variabel yang missing atau salah tipe, app CRASH
// sebelum jalan — zero tolerance untuk config error
// ──────────────────────────────────────────────────────────
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().min(1).max(65535).default(3000),
    APP_NAME: z.string().min(1).default('EkoService'),
    APP_URL: z.string().url().default('http://localhost:3000'),
    APP_FRONTEND_URL: z.string().url().default('http://localhost:5173'),
    // Database
    DATABASE_URL: z.string().url(),
    // JWT
    JWT_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    // API Key
    API_KEY: z.string().min(16),
    // CORS
    ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
    // Security
    ENABLE_RATE_LIMIT: z.coerce.boolean().default(true),
    // Logging
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    const errors = parsed.error.format();
    console.error('❌ Environment validation failed:');
    console.error(JSON.stringify(errors, null, 2));
    process.exit(1);
}
export const config = parsed.data;
// ──────────────────────────────────────────────────────────
// Derived values
// ──────────────────────────────────────────────────────────
export const isDev = config.NODE_ENV === 'development';
export const isProd = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';
export const allowedOrigins = config.ALLOWED_ORIGINS.split(',').map((s) => s.trim());
export const jwtAccessExpiresMs = parseExpires(config.JWT_ACCESS_EXPIRES_IN);
export const jwtRefreshExpiresMs = parseExpires(config.JWT_REFRESH_EXPIRES_IN);
// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
function parseExpires(value) {
    const match = value.match(/^(\d+)([smhd])$/);
    if (!match)
        return 15 * 60 * 1000; // fallback 15 menit
    const num = parseInt(match[1], 10);
    const unit = match[2];
    const map = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };
    return num * map[unit];
}
//# sourceMappingURL=index.js.map