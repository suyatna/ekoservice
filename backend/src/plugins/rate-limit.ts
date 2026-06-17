import { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { config } from '../config/index.js';

// ──────────────────────────────────────────────────────────
// Rate Limiting
// ──────────────────────────────────────────────────────────
// Global: 100 req/menit per IP (atau per API key)
// ──────────────────────────────────────────────────────────

export async function rateLimitPlugin(fastify: FastifyInstance) {
  if (!config.ENABLE_RATE_LIMIT) {
    fastify.log.warn('Rate limiting DISABLED');
    return;
  }

  await fastify.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder(_request, context) {
      return {
        message: `Terlalu banyak request. Tunggu ${context.after} sebelum mencoba lagi.`,
        code: 'RATE_LIMIT_EXCEEDED',
        requestId: 'system',
      };
    },
    keyGenerator(request) {
      const apiKey = request.headers['x-api-key'] as string | undefined;
      if (apiKey) return `api-key:${apiKey}`;
      const forwarded = request.headers['x-forwarded-for'] as string | undefined;
      if (forwarded) return `xff:${forwarded.split(',')[0]?.trim()}`;
      return `ip:${request.ip}`;
    },
    addHeadersOnExceeding: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
  });
}

// Backwards-compat export
export const authRateLimitPlugin = rateLimitPlugin;
