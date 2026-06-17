// ──────────────────────────────────────────────────────────
// Standardized Response Envelope
// Semua response API mengikuti format ini:
// Success: { data: T, meta: { requestId, timestamp } }
// Paginated: { data: T[], meta: { total, page, limit, requestId, timestamp } }
// Error: { message: string, code: string, requestId: string }
// ──────────────────────────────────────────────────────────

export interface ResponseMeta {
  requestId: string;
  timestamp: string;
}

export interface PaginatedMeta extends ResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: ResponseMeta;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiError {
  message: string;
  code: string;
  requestId: string;
}

// ──────────────────────────────────────────────────────────
// Factory functions
// ──────────────────────────────────────────────────────────

export function ok<T>(data: T, requestId: string): ApiResponse<T> {
  return {
    data,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  requestId: string
): PaginatedResponse<T> {
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

export function fail(
  message: string,
  code: string,
  requestId: string
): ApiError {
  return {
    message,
    code,
    requestId,
  };
}
