import { ForbiddenError } from '../shared/errors.js';
const hakAkses = {
    SUPER_ADMIN: ['*'],
    ADMIN_OPERASIONAL: [
        'booking:baca',
        'booking:bikin',
        'booking:ubah',
        'booking:hapus',
        'booking:assign',
        'teknisi:baca',
        'teknisi:bikin',
        'audit:baca',
        'dashboard:baca',
    ],
    CUSTOMER: [
        'booking:bikin',
        'booking:baca_milik_sendiri',
        'pembayaran:baca_milik_sendiri',
    ],
    TEKNISI: [
        'tugas:baca_milik_sendiri',
        'tugas:ubah',
        'booking:baca',
        'sparepart:baca',
    ],
    FINANCE: [
        'pembayaran:baca',
        'pembayaran:proses',
        'transaksi:baca',
        'transaksi:bikin',
        'transaksi:ubah',
        'refund:proses',
        'laporan:baca',
        'dashboard:baca',
    ],
    WAREHOUSE: [
        'stok:baca',
        'stok:ubah',
        'stok:bikin',
        'sparepart:baca',
        'sparepart:ubah',
        'sparepart:bikin',
        'reservasi:baca',
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
        // SUPER_ADMIN selalu punya akses
        if (role === 'SUPER_ADMIN')
            return;
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
export const requireAdmin = authorize('booking:baca', 'dashboard:baca');
export const requireFinance = authorize('pembayaran:baca', 'laporan:baca');
export const requireWarehouse = authorize('stok:baca');
export const requireTeknisi = authorize('tugas:baca_milik_sendiri');
export const requireCustomer = authorize('booking:bikin');
//# sourceMappingURL=authorize.js.map