import { prisma } from '../shared/prisma.js';
import { config } from '../config/index.js';
export async function writeAuditLog(context) {
    if (!config.ENABLE_AUDIT_LOG)
        return;
    // Fire-and-forget: jangan block
    prisma.auditLog
        .create({
        data: {
            userId: context.userId,
            apiKeyId: context.apiKeyId,
            action: context.action,
            resource: context.resource,
            resourceId: context.resourceId,
            oldData: context.oldData,
            newData: context.newData,
            ipAddress: '', // akan di-override
            userAgent: '',
            requestId: '',
        },
    })
        .catch((err) => {
        console.error('Failed to write audit log:', err);
    });
}
export async function auditPlugin(fastify) {
    fastify.decorate('audit', async (ctx) => {
        await writeAuditLog(ctx);
    });
}
// ──────────────────────────────────────────────────────────
// Helper untuk extract audit info dari request
// ──────────────────────────────────────────────────────────
export function getAuditInfo(request) {
    const forwarded = request.headers['x-forwarded-for'];
    const ipAddress = forwarded
        ? forwarded.split(',')[0]?.trim() ?? 'unknown'
        : request.ip;
    const userAgent = request.headers['user-agent'] ?? 'unknown';
    const userId = request.user?.sub;
    return { userId, ipAddress, userAgent };
}
// ──────────────────────────────────────────────────────────
// Action naming convention
// ──────────────────────────────────────────────────────────
export const AUDIT_ACTIONS = {
    // Auth
    AUTH_LOGIN: 'auth.login',
    AUTH_LOGOUT: 'auth.logout',
    AUTH_REGISTER: 'auth.register',
    AUTH_REFRESH: 'auth.refresh',
    // Booking
    BOOKING_CREATE: 'booking.create',
    BOOKING_UPDATE: 'booking.update',
    BOOKING_DELETE: 'booking.delete',
    BOOKING_ASSIGN: 'booking.assign',
    // Transaksi
    TRANSAKSI_CREATE: 'transaksi.create',
    TRANSAKSI_UPDATE: 'transaksi.update',
    TRANSAKSI_DELETE: 'transaksi.delete',
    // Sparepart
    SPAREPART_CREATE: 'sparepart.create',
    SPAREPART_UPDATE: 'sparepart.update',
    SPAREPART_DELETE: 'sparepart.delete',
    // User
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',
};
//# sourceMappingURL=audit-log.js.map