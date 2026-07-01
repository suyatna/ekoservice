import * as FastifyNS from 'fastify';
import { config, isDev } from './config/index.js';
import { requestContextPlugin } from './plugins/request-context.js';
import { helmetPlugin } from './plugins/helmet.js';
import { corsPlugin } from './plugins/cors.js';
import { rateLimitPlugin } from './plugins/rate-limit.js';
import { jwtPlugin } from './plugins/auth.js';
import { createVerifier } from 'fast-jwt';
import cookie from '@fastify/cookie';
import { validateApiKey } from './middleware/validate-api-key.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { bookingRoutes } from './modules/booking/booking.routes.js';
import { transaksiRoutes } from './modules/transaksi/transaksi.routes.js';
import { sparepartRoutes } from './modules/sparepart/sparepart.routes.js';
import { ok, fail } from './shared/response.js';
import { serializeError } from './shared/errors.js';
import { allowedOrigins } from './config/index.js';

const Fastify = (FastifyNS as any).default ?? FastifyNS;

export async function buildApp() {
  const fastify = Fastify({
    logger: { level: config.LOG_LEVEL },
    requestIdHeader: 'x-request-id',
    disableRequestLogging: false,
  });

  await fastify.register(cookie);
  await fastify.register(requestContextPlugin);
  await fastify.register(helmetPlugin);
  await fastify.register(corsPlugin);
  await fastify.register(rateLimitPlugin);
  await fastify.register(jwtPlugin);
  const jwtVerifier = createVerifier({ key: config.JWT_SECRET, algorithms: ['HS512'] });

  // Health check (public)
  fastify.get('/health', async (request: any) => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    requestId: request.requestId,
  }));

  // Global preHandler: API Key validation
  fastify.addHook('preHandler', async (request: any, reply: any) => {
    if (request.url.startsWith('/health')) return;

    // CSRF check: state-changing methods require valid Origin header
    const method = request.method;
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const origin = request.headers['origin'];
      if (origin && !allowedOrigins.includes(origin)) {
        reply.code(403).send(
          fail('Origin tidak diizinkan', 'FORBIDDEN', request.requestId)
        );
        return;
      }
    }

    await validateApiKey(request, reply);
  });

  // Global preHandler: JWT authentication
  fastify.addHook('preHandler', async (request: any, reply: any) => {
    const skip = ['/health', '/auth/login', '/auth/refresh', '/auth/logout'];
    if (skip.some((p) => request.url.startsWith(p))) return;
    try {
      const authHeader = request.headers['authorization'] as string | undefined;
      if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('No token');
      const token = authHeader.slice(7);
      const payload = jwtVerifier(token) as any;
      (request as any).user = payload;
    } catch {
      reply.code(401).send(fail('Token tidak valid atau sudah kadaluarsa', 'UNAUTHORIZED', request.requestId));
    }
  });

  fastify.setErrorHandler((error: any, request: any, reply: any) => {
    fastify.log.error({ requestId: request.requestId, err: serializeError(error), url: request.url });
    if (error.validation) {
      return reply.code(400).send(fail(error.validation[0]?.message ?? 'Validasi gagal', 'VALIDATION_ERROR', request.requestId));
    }
    if (error.code) {
      return reply.code(error.statusCode ?? 500).send(
        fail(error.publicMessage ?? error.message, error.code, request.requestId)
      );
    }
    return reply.code(500).send(fail('Terjadi kesalahan pada sistem', 'INTERNAL_ERROR', request.requestId));
  });

  fastify.setNotFoundHandler((request: any, reply: any) => {
    reply.code(404).send(fail('Endpoint tidak ditemukan', 'NOT_FOUND', request.requestId));
  });

  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(bookingRoutes, { prefix: '/booking' });
  await fastify.register(transaksiRoutes, { prefix: '/transaksi' });
  await fastify.register(sparepartRoutes, { prefix: '/sparepart' });

  fastify.addHook('onReady', async () => {
    fastify.log.info(`🚀 ${config.APP_NAME} ready on port ${config.PORT}`);
    fastify.log.info(`📦 Environment: ${config.NODE_ENV}`);
    fastify.log.info(`🔒 Rate limiting: ${config.ENABLE_RATE_LIMIT ? 'ON' : 'OFF'}`);
  });

  return fastify;
}

let serverlessAppPromise: ReturnType<typeof buildApp> | undefined;

function getServerlessApp() {
  if (!serverlessAppPromise) {
    serverlessAppPromise = buildApp().then(async (app) => {
      await app.ready();
      return app;
    });
  }
  return serverlessAppPromise;
}

async function readServerlessBody(request: any) {
  if (request.method === 'GET' || request.method === 'HEAD') return undefined;
  if (request.body !== undefined) {
    if (Buffer.isBuffer(request.body) || typeof request.body === 'string') return request.body;
    return JSON.stringify(request.body);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
}

export default async function handler(request: any, response: any) {
  const app = await getServerlessApp();
  const result = await app.inject({
    method: request.method,
    url: request.url || '/',
    headers: request.headers,
    payload: await readServerlessBody(request),
  });

  response.statusCode = result.statusCode;
  Object.entries(result.headers).forEach(([key, value]) => {
    if (value !== undefined) response.setHeader(key, value as any);
  });
  response.end(result.rawPayload ?? result.payload);
}
