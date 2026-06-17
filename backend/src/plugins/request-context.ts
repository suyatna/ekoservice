import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

// ──────────────────────────────────────────────────────────
// Request Context Plugin
// ──────────────────────────────────────────────────────────

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
    requestStartTime: number;
  }
}

export async function requestContextPlugin(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    request.requestId = (request.headers['x-request-id'] as string) || uuidv4();
    request.requestStartTime = Date.now();
  });

  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header('X-Request-ID', request.requestId);
  });
}
