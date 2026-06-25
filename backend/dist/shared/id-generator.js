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
};
export function generateId(prefix) {
    const id = uuidv4().replace(/-/g, '').slice(0, 6);
    return `${prefix}-${id}`;
}
export function generateBookingId() {
    return generateId('BK');
}
export function generateTransaksiId() {
    return generateId('TX');
}
export function generateSparepartId() {
    return generateId('SP');
}
export function generateUUID() {
    return uuidv4();
}
// ──────────────────────────────────────────────────────────
// Refresh Token Generator
// ──────────────────────────────────────────────────────────
export function generateRefreshToken() {
    return [
        uuidv4().replace(/-/g, ''),
        uuidv4().replace(/-/g, ''),
    ].join('.');
}
//# sourceMappingURL=id-generator.js.map