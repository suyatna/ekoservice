import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { createHash } from 'crypto';
import { config } from '../config/index.js';
import { ApiKeyInvalidError, UnauthorizedError } from '../shared/errors.js';

// ──────────────────────────────────────────────────────────
// API Key Validator
// ──────────────────────────────────────────────────────────
// Semua request HARUS punya header X-API-Key
// Validasi: hash input → bandingkan dengan hash di DB (atau env)
// Keuntungan: API key tidak pernah masuk log/cache dalam plaintext
// ──────────────────────────────────────────────────────────

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

export function isValidApiKeyFormat(key: string): boolean {
  // Minimal 16 char, alphanumeric + dash + underscore
  return /^[a-zA-Z0-9_-]{16,}$/.test(key);
}

export async function validateApiKey(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const apiKey = request.headers['x-api-key'] as string | undefined;

  if (!apiKey) {
    throw new UnauthorizedError('Header X-API-Key wajib ada');
  }

  if (!isValidApiKeyFormat(apiKey)) {
    throw new ApiKeyInvalidError();
  }

  // Hash input untuk comparison
  const hashedInput = hashApiKey(apiKey);
  const hashedEnv = hashApiKey(config.API_KEY);

  if (hashedInput !== hashedEnv) {
    throw new ApiKeyInvalidError();
  }
}

// ──────────────────────────────────────────────────────────
// Global preHandler: validasi API Key di semua route
// ──────────────────────────────────────────────────────────

export function setupApiKeyMiddleware(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (request, reply) => {
    const skipPaths = ['/health'];
    if (skipPaths.some((p) => request.url.startsWith(p))) {
      return;
    }

    await validateApiKey(request, reply);
  });
}
