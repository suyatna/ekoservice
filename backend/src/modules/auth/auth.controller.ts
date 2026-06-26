import { FastifyRequest, FastifyReply } from 'fastify';
import { createSigner } from 'fast-jwt';
import {
  masuk,
  daftar,
  getUserById,
  createRefreshToken,
  validateRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
} from './auth.service.js';
import { ok, fail } from '../../shared/response.js';
import { ValidationError } from '../../shared/errors.js';
import { JwtPayload } from '../../plugins/auth.js';
import { config } from '../../config/index.js';

const signAccessToken = createSigner({
  key: config.JWT_SECRET,
  algorithm: 'HS512',
  expiresIn: '15m',
});

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Record<string, unknown>;

    if (!body || typeof body !== 'object') {
      throw new ValidationError('Body request tidak valid');
    }

    const username = body['username'] as string | undefined;
    const password = body['password'] as string | undefined;

    if (!username || !password) {
      throw new ValidationError('Username dan password wajib diisi');
    }

    const result = await masuk(username, password);

    const payload: JwtPayload = {
      sub: result.user.id,
      role: result.user.role,
      email: result.user.email,
    };
    const accessToken = signAccessToken(payload) as string;
    const refreshToken = await createRefreshToken(result.user.id);

    reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      })
      .code(200);

    return reply.send(ok({ accessToken, user: result.user }, request.requestId));
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Record<string, unknown>;

    if (!body || typeof body !== 'object') {
      throw new ValidationError('Body request tidak valid');
    }

    const nama = body['nama'] as string | undefined;
    const email = body['email'] as string | undefined;
    const password = body['password'] as string | undefined;

    if (!nama || !email || !password) {
      throw new ValidationError('Nama, email, dan password wajib diisi');
    }

    const result = await daftar({ nama, email, password });

    const payload: JwtPayload = {
      sub: result.user.id,
      role: result.user.role,
      email: result.user.email,
    };
    const accessToken = signAccessToken(payload) as string;
    const refreshToken = await createRefreshToken(result.user.id);

    reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      })
      .code(201);

    return reply.send(ok({ accessToken, user: result.user }, request.requestId));
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = (request.cookies as Record<string, string>)['refreshToken'];

    if (!refreshToken) {
      return reply.code(401).send(
        fail('Refresh token tidak ditemukan', 'UNAUTHORIZED', request.requestId)
      );
    }

    const { userId } = await validateRefreshToken(refreshToken);
    const newRefreshToken = await rotateRefreshToken(refreshToken);

    const user = await getUserById(userId);

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };
    const accessToken = signAccessToken(payload) as string;

    reply
      .setCookie('refreshToken', newRefreshToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      })
      .code(200);

    return reply.send(ok({ accessToken, user }, request.requestId));
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = (request.cookies as Record<string, string>)['refreshToken'];

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    reply
      .clearCookie('refreshToken', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .code(204);

    return reply.send();
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as { sub?: string }).sub ?? (request.user as { id?: string }).id;
    if (!userId) {
      return reply.code(401).send(
        fail('Token tidak valid', 'UNAUTHORIZED', request.requestId)
      );
    }
    const user = await getUserById(userId);
    return reply.send(ok(user, request.requestId));
  }
}

export const authController = new AuthController();
