import { v4 as uuidv4 } from 'uuid';

// ──────────────────────────────────────────────────────────
// ID Generator dengan Prefix
// Format: PREFIX-<6-char-from-uuid>
// Contoh: BK-a3f2c1, TX-b4e9d7, SP-c1a8f3
// ──────────────────────────────────────────────────────────

const PREFIXES = {
  BK: 'Booking',
  TX: 'Transaksi',
  SP: 'Sparepart',
} as const;

type Prefix = keyof typeof PREFIXES;

export function generateId(prefix: Prefix): string {
  const id = uuidv4().replace(/-/g, '').slice(0, 6);
  return `${prefix}-${id}`;
}

export function generateBookingId(): string {
  return generateId('BK');
}

export function generateTransaksiId(): string {
  return generateId('TX');
}

export function generateSparepartId(): string {
  return generateId('SP');
}

export function generateUUID(): string {
  return uuidv4();
}

// ──────────────────────────────────────────────────────────
// Refresh Token Generator
// ──────────────────────────────────────────────────────────

export function generateRefreshToken(): string {
  return [
    uuidv4().replace(/-/g, ''),
    uuidv4().replace(/-/g, ''),
  ].join('.');
}
