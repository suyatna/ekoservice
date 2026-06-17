import { createSigner } from 'fast-jwt';
import { masuk, daftar, getUserById, createRefreshToken, validateRefreshToken, rotateRefreshToken, revokeRefreshToken, } from './auth.service.js';
import { ok, fail } from '../../shared/response.js';
import { ValidationError } from '../../shared/errors.js';
import { config } from '../../config/index.js';
const signAccessToken = createSigner({
    key: config.JWT_SECRET,
    algorithm: 'HS512',
    expiresIn: '15m',
});
export class AuthController {
    async login(request, reply) {
        const body = request.body;
        if (!body || typeof body !== 'object') {
            throw new ValidationError('Body request tidak valid');
        }
        const email = body['email'];
        const password = body['password'];
        if (!email || !password) {
            throw new ValidationError('Email dan password wajib diisi');
        }
        const result = await masuk(email, password);
        const payload = {
            sub: result.user.id,
            role: result.user.role,
            email: result.user.email,
        };
        const accessToken = signAccessToken(payload);
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
    async register(request, reply) {
        const body = request.body;
        if (!body || typeof body !== 'object') {
            throw new ValidationError('Body request tidak valid');
        }
        const nama = body['nama'];
        const email = body['email'];
        const password = body['password'];
        if (!nama || !email || !password) {
            throw new ValidationError('Nama, email, dan password wajib diisi');
        }
        const result = await daftar({ nama, email, password });
        const payload = {
            sub: result.user.id,
            role: result.user.role,
            email: result.user.email,
        };
        const accessToken = signAccessToken(payload);
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
    async refresh(request, reply) {
        const refreshToken = request.cookies['refreshToken'];
        if (!refreshToken) {
            return reply.code(401).send(fail('Refresh token tidak ditemukan', 'UNAUTHORIZED', request.requestId));
        }
        const { userId } = await validateRefreshToken(refreshToken);
        const newRefreshToken = await rotateRefreshToken(refreshToken);
        const user = await getUserById(userId);
        const payload = {
            sub: user.id,
            role: user.role,
            email: user.email,
        };
        const accessToken = signAccessToken(payload);
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
    async logout(request, reply) {
        const refreshToken = request.cookies['refreshToken'];
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
    async me(request, reply) {
        const userId = request.user.sub ?? request.user.id;
        if (!userId) {
            return reply.code(401).send(fail('Token tidak valid', 'UNAUTHORIZED', request.requestId));
        }
        const user = await getUserById(userId);
        return reply.send(ok(user, request.requestId));
    }
}
export const authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map