import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { prisma } from '../shared/prisma.js';
import { config } from '../config/index.js';

// ──────────────────────────────────────────────────────────
// Audit Log Middleware
// ──────────────────────────────────────────────────────────
// Setiap write operation (POST, PUT, PATCH, DELETE) dicatat
// ke tabel audit_log secara async (tidak blocking response)
//
// Format action: "resource.verb"
// Contoh: "booking.create", "user.update", "transaksi.delete"
// ──────────────────────────────────────────────────────────

export interface AuditContext {
  userId?: string;
  apiKeyId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldData?: unknown;
  newData?: unknown;
}

export async function writeAuditLog(context: AuditContext) {
  if (!config.ENABLE_AUDIT_LOG) return;

  // Fire-and-forget: jangan block
  prisma.auditLog
    .create({
      data: {
        userId: context.userId,
        apiKeyId: context.apiKeyId,
        action: context.action,
        resource: context.resource,
        resourceId: context.resourceId,
        oldData: context.oldData as object | undefined,
        newData: context.newData as object | undefined,
        ipAddress: '', // akan di-override
        userAgent: '',
        requestId: '',
      },
    })
    .catch((err) => {
      console.error('Failed to write audit log:', err);
    });
}

// ──────────────────────────────────────────────────────────
// Audit decorator untuk Fastify
// ──────────────────────────────────────────────────────────

declare module 'fastify' {
  interface FastifyInstance {
    audit: (ctx: Omit<AuditContext, 'requestId'>) => Promise<void>;
  }
}

export async function auditPlugin(fastify: FastifyInstance) {
  fastify.decorate('audit', async (ctx: Omit<AuditContext, 'requestId'>) => {
    await writeAuditLog(ctx);
  });
}

// ──────────────────────────────────────────────────────────
// Helper untuk extract audit info dari request
// ──────────────────────────────────────────────────────────

export function getAuditInfo(request: FastifyRequest): {
  userId?: string;
  ipAddress: string;
  userAgent: string;
} {
  const forwarded = request.headers['x-forwarded-for'] as string | undefined;
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
} as const;
