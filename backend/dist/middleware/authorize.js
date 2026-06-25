import { ForbiddenError } from '../shared/errors.js';
const hakAkses = {
    ADMIN: [
        'booking:baca',
        'booking:bikin',
        'booking:ubah',
        'booking:hapus',
        'sparepart:baca',
        'sparepart:ubah',
        'sparepart:bikin',
        'transaksi:baca',
        'transaksi:bikin',
        'transaksi:ubah',
    ],
};
export function punyaIzin(role, izin) {
    const rolePermissions = hakAkses[role];
    if (!rolePermissions)
        return false;
    if (rolePermissions.includes('*'))
        return true;
    // Cek exact match
    if (rolePermissions.includes(izin))
        return true;
    // Cek "resource:*" wildcard (e.g., "booking:*" = semua aksi booking)
    const [resource] = izin.split(':');
    if (resource && rolePermissions.includes(`${resource}:*`))
        return true;
    return false;
}
// ──────────────────────────────────────────────────────────
// Middleware factory
// ──────────────────────────────────────────────────────────
export function authorize(...requiredPermissions) {
    return async function (request, reply) {
        const user = request.user;
        if (!user) {
            throw new ForbiddenError('User tidak ditemukan di token');
        }
        const role = user.role;
        // Cek apakah user punya SEMUA izin yang diperlukan
        const missingPermissions = requiredPermissions.filter((perm) => !punyaIzin(role, perm));
        if (missingPermissions.length > 0) {
            throw new ForbiddenError(`Kamu tidak punya izin: ${missingPermissions.join(', ')}`);
        }
    };
}
// ──────────────────────────────────────────────────────────
// Predefined role guards
// ──────────────────────────────────────────────────────────
export const requireAdmin = authorize('booking:baca');
//# sourceMappingURL=authorize.js.map