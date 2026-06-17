import { authController } from './auth.controller.js';
// ──────────────────────────────────────────────────────────
// Auth Routes
// ──────────────────────────────────────────────────────────
// Public routes: login, register, refresh, logout
// Protected routes: me
// ──────────────────────────────────────────────────────────
// Auth-specific rate limit store: 5 req/min per IP
const authStore = new Map();
function getIp(request) {
    const fwd = request.headers['x-forwarded-for'];
    return fwd ? fwd.split(',')[0]?.trim() : request.ip;
}
function checkAuthRateLimit(request) {
    const ip = getIp(request);
    const now = Date.now();
    const entry = authStore.get(ip);
    if (!entry || entry.resetAt <= now) {
        authStore.set(ip, { count: 1, resetAt: now + 60_000 });
        return false;
    }
    if (entry.count >= 5)
        return true;
    entry.count++;
    return false;
}
export async function authRoutes(fastify) {
    // ── Auth rate limit preHandler (5 req/min for login/register) ──
    fastify.addHook('onRequest', async (request, reply) => {
        const url = request.url ?? '';
        if (!url.startsWith('/auth/login') && !url.startsWith('/auth/register'))
            return;
        if (checkAuthRateLimit(request)) {
            reply.code(429).send({
                message: 'Terlalu banyak percobaan login. Tunggu 1 menit sebelum mencoba lagi.',
                code: 'AUTH_RATE_LIMIT_EXCEEDED',
                requestId: request.requestId,
            });
        }
    });
    // ── Public ───────────────────────────────────────────
    // POST /auth/login
    fastify.post('/login', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                },
                required: ['email', 'password'],
            },
        },
    }, async (request, reply) => {
        return authController.login(request, reply);
    });
    // POST /auth/register
    fastify.post('/register', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    nama: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                },
                required: ['nama', 'email', 'password'],
            },
        },
    }, async (request, reply) => {
        return authController.register(request, reply);
    });
    // POST /auth/refresh
    fastify.post('/refresh', {
        config: { skipAuth: true },
    }, async (request, reply) => {
        return authController.refresh(request, reply);
    });
    // POST /auth/logout
    fastify.post('/logout', {
        config: { skipAuth: true },
    }, async (request, reply) => {
        return authController.logout(request, reply);
    });
    // ── Protected ───────────────────────────────────────
    // GET /auth/me
    fastify.get('/me', {}, async (request, reply) => {
        return authController.me(request, reply);
    });
}
//# sourceMappingURL=auth.routes.js.map