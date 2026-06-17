import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { config } from '../config/index.js';

// ──────────────────────────────────────────────────────────
// JWT Plugin
// ──────────────────────────────────────────────────────────
// Access Token: ES512 algorithm, 15 menit, payload: sub, role, email
// Refresh Token: di-handle manual via httpOnly cookie + DB
// ──────────────────────────────────────────────────────────

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtUser;
  }
}

export interface JwtPayload {
  sub: string; // userId
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface JwtUser {
  id: string;
  role: string;
  email: string;
}

export async function jwtPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyJwt, {
    secret: config.JWT_SECRET,
    sign: {
      algorithm: 'HS512',
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    },
    verify: {
      algorithms: ['HS512'] as const,
    },
  });
}

// ──────────────────────────────────────────────────────────
// JWT Verify decorator
// ──────────────────────────────────────────────────────────

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function authenticatePlugin(fastify: FastifyInstance) {
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({
          message: 'Token tidak valid atau sudah kadaluarsa',
          code: 'UNAUTHORIZED',
          requestId: request.requestId,
        });
      }
    }
  );
}
