// ──────────────────────────────────────────────────────────
// Custom Application Errors
// Setiap error punya code yang bisa di-handle client-side
// ──────────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly publicMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ── 400 Bad Request ────────────────────────────────────────

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 'BAD_REQUEST', 400);
  }
}

// ── 401 Unauthorized ──────────────────────────────────────

export class UnauthorizedError extends AppError {
  constructor(message = 'Autentikasi diperlukan') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Email atau password salah', 'INVALID_CREDENTIALS', 401);
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super('Token sudah kadaluarsa', 'TOKEN_EXPIRED', 401);
  }
}

// ── 403 Forbidden ─────────────────────────────────────────

export class ForbiddenError extends AppError {
  constructor(message = 'Kamu tidak punya akses ke resource ini') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ApiKeyInvalidError extends AppError {
  constructor() {
    super('API Key tidak valid', 'API_KEY_INVALID', 403);
  }
}

// ── 404 Not Found ──────────────────────────────────────────

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} tidak ditemukan`, 'NOT_FOUND', 404);
  }
}

// ── 409 Conflict ──────────────────────────────────────────

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

export class EmailAlreadyExistsError extends ConflictError {
  constructor() {
    super('Email sudah terdaftar');
  }
}

// ── 429 Too Many Requests ─────────────────────────────────

export class RateLimitError extends AppError {
  constructor() {
    super('Terlalu banyak request. Coba lagi nanti.', 'RATE_LIMIT_EXCEEDED', 429);
  }
}

// ── 500 Internal Server Error ─────────────────────────────

export class InternalError extends AppError {
  constructor(message = 'Terjadi kesalahan pada sistem') {
    super(message, 'INTERNAL_ERROR', 500);
  }
}

// ──────────────────────────────────────────────────────────
// Error serializer (for logging)
// ──────────────────────────────────────────────────────────

export function serializeError(error: unknown): string {
  if (error instanceof AppError) {
    return `[${error.code}] ${error.message}`;
  }
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
}
