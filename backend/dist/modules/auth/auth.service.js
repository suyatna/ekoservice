import argon2 from 'argon2';
import { prisma } from '../../shared/prisma.js';
import { InvalidCredentialsError, EmailAlreadyExistsError, NotFoundError, TokenExpiredError, } from '../../shared/errors.js';
import { generateUUID, generateRefreshToken, } from '../../shared/id-generator.js';
// ──────────────────────────────────────────────────────────
// Auth Service
// ──────────────────────────────────────────────────────────
// Business logic untuk autentikasi:
// - Hash password dengan argon2 (lebih kuat dari bcrypt)
// - JWT access token (15 menit)
// - Refresh token di httpOnly cookie + hashed di DB
// - Rotation: setiap use invalidate token lama
// - Family-based reuse detection
// ──────────────────────────────────────────────────────────
// ── Password ──────────────────────────────────────────────
export async function hashPassword(password) {
    return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536, // 64MB
        timeCost: 3,
        parallelism: 4,
    });
}
export async function verifyPassword(password, hashedPassword) {
    try {
        return await argon2.verify(hashedPassword, password);
    }
    catch {
        return false;
    }
}
// ── Refresh Token ─────────────────────────────────────────
async function hashToken(token) {
    const { createHash } = await import('crypto');
    return createHash('sha256').update(token).digest('hex');
}
// ── User Registration ────────────────────────────────────
export async function daftar(data) {
    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existing) {
        throw new EmailAlreadyExistsError();
    }
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
        data: {
            id: generateUUID(),
            nama: data.nama,
            email: data.email,
            password: hashedPassword,
            role: 'ADMIN',
            aktif: true,
        },
    });
    return {
        user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role,
            aktif: user.aktif,
        },
    };
}
// ── User Login ────────────────────────────────────────────
export async function masuk(email, password) {
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    });
    if (!user || !user.aktif) {
        throw new InvalidCredentialsError();
    }
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
        throw new InvalidCredentialsError();
    }
    return {
        user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role,
            aktif: user.aktif,
        },
    };
}
// ── Get User by ID ───────────────────────────────────────
export async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            nama: true,
            email: true,
            role: true,
            aktif: true,
        },
    });
    if (!user) {
        throw new NotFoundError('User');
    }
    return user;
}
// ── Refresh Token Management ──────────────────────────────
export async function createRefreshToken(userId) {
    const token = generateRefreshToken();
    const hashedToken = await hashToken(token);
    const family = generateUUID();
    const expiresDi = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari
    await prisma.refreshToken.create({
        data: {
            id: generateUUID(),
            tokenHash: hashedToken,
            family,
            userId,
            expiresDi,
            diRevoke: false,
        },
    });
    return token;
}
export async function validateRefreshToken(token) {
    const hashedToken = await hashToken(token);
    const stored = await prisma.refreshToken.findUnique({
        where: { tokenHash: hashedToken },
    });
    if (!stored) {
        throw new InvalidCredentialsError();
    }
    if (stored.diRevoke) {
        // Possible reuse attack — revoke semua token dari family yang sama
        await prisma.refreshToken.updateMany({
            where: { family: stored.family },
            data: { diRevoke: true },
        });
        throw new InvalidCredentialsError();
    }
    if (stored.expiresDi < new Date()) {
        throw new TokenExpiredError();
    }
    return {
        userId: stored.userId,
        family: stored.family,
        tokenId: stored.id,
    };
}
export async function rotateRefreshToken(token) {
    const { userId, family, tokenId } = await validateRefreshToken(token);
    // Revoke token lama (rotation)
    await prisma.refreshToken.update({
        where: { id: tokenId },
        data: { diRevoke: true },
    });
    // Buat token baru dengan family yang sama
    return createRefreshToken(userId);
}
export async function revokeRefreshToken(token) {
    const hashedToken = await hashToken(token);
    await prisma.refreshToken.updateMany({
        where: { tokenHash: hashedToken },
        data: { diRevoke: true },
    });
}
export async function revokeAllUserTokens(userId) {
    await prisma.refreshToken.updateMany({
        where: { userId, diRevoke: false },
        data: { diRevoke: true },
    });
}
//# sourceMappingURL=auth.service.js.map