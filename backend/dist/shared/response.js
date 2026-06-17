// ──────────────────────────────────────────────────────────
// Standardized Response Envelope
// Semua response API mengikuti format ini:
// Success: { data: T, meta: { requestId, timestamp } }
// Paginated: { data: T[], meta: { total, page, limit, requestId, timestamp } }
// Error: { message: string, code: string, requestId: string }
// ──────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────
// Factory functions
// ──────────────────────────────────────────────────────────
export function ok(data, requestId) {
    return {
        data,
        meta: {
            requestId,
            timestamp: new Date().toISOString(),
        },
    };
}
export function paginated(data, total, page, limit, requestId) {
    return {
        data,
        meta: {
            requestId,
            timestamp: new Date().toISOString(),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}
export function fail(message, code, requestId) {
    return {
        message,
        code,
        requestId,
    };
}
//# sourceMappingURL=response.js.map