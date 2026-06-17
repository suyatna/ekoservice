import { prisma } from '../../shared/prisma.js';
import { generateBookingId, generateUUID } from '../../shared/id-generator.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors.js';
import { SkemaBookingBuat, SkemaBookingUbah, SkemaBookingFilter } from './booking.schemas.js';
import { Role } from '@prisma/client';

// ──────────────────────────────────────────────────────────
// Booking Service
// ──────────────────────────────────────────────────────────

export async function buatBooking(
  data: SkemaBookingBuat,
  dibuatOlehId: string
) {
  return prisma.booking.create({
    data: {
      id: generateUUID(),
      idTampilan: generateBookingId(),
      namaPelanggan: data.namaPelanggan,
      noTelpPelanggan: data.noTelpPelanggan || '',
      alamat: '',
      kategori: data.kategori,
      tglBooking: data.tglBooking ? new Date(data.tglBooking) : new Date(),
      dibuatOleh: { connect: { id: dibuatOlehId } },
      status: 'BOOKING_DIBUAT',
    },
    include: {
      teknisi: {
        select: { id: true, nama: true, noTelp: true },
      },
    },
  });
}

export async function daftarBooking(
  filter: SkemaBookingFilter,
  userId: string,
  userRole: Role
) {
  const { page, limit, search, status, kategori, dari, sampai } = filter;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { idTampilan: { contains: search, mode: 'insensitive' } },
      { namaPelanggan: { contains: search, mode: 'insensitive' } },
      { noTelpPelanggan: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) where.status = status;
  if (kategori) where.kategori = kategori;
  if (dari || sampai) {
    where.tglBooking = {
      ...(dari ? { gte: new Date(dari) } : {}),
      ...(sampai ? { lte: new Date(sampai) } : {}),
    };
  }

  // RBAC: CUSTOMER hanya bisa lihat miliknya sendiri
  if (userRole === 'CUSTOMER') {
    where.dibuatOlehId = userId;
  }
  // TEKNISI hanya bisa lihat yang ditugaskan
  if (userRole === 'TEKNISI') {
    where.teknisiId = userId;
  }

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { dibuatDi: 'desc' },
      include: {
        teknisi: { select: { id: true, nama: true } },
        dibuatOleh: { select: { id: true, nama: true } },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getBookingById(id: string, userId: string, userRole: Role) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      teknisi: { select: { id: true, nama: true, noTelp: true } },
      dibuatOleh: { select: { id: true, nama: true, email: true } },
      transaksi: {
        orderBy: { dibuatDi: 'desc' },
        select: { id: true, nominal: true, jenis: true, dibuatDi: true },
      },
      fotoServis: {
        orderBy: { dibuatDi: 'asc' },
        select: { id: true, url: true, jenis: true, caption: true },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking');
  }

  // RBAC check
  if (userRole === 'CUSTOMER' && booking.dibuatOlehId !== userId) {
    throw new ForbiddenError();
  }
  if (userRole === 'TEKNISI' && booking.teknisiId !== userId) {
    throw new ForbiddenError();
  }

  return booking;
}

export async function ubahBooking(
  id: string,
  data: SkemaBookingUbah,
  userId: string,
  userRole: Role
) {
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Booking');

  // RBAC: CUSTOMER tidak bisa ubah
  if (userRole === 'CUSTOMER') {
    throw new ForbiddenError('Kamu tidak bisa mengubah booking');
  }

  // TEKNISI hanya bisa ubah jika ditugaskan
  if (userRole === 'TEKNISI' && existing.teknisiId !== userId) {
    throw new ForbiddenError();
  }

  const updateData: Record<string, unknown> = {};

  if (data.namaPelanggan !== undefined) updateData.namaPelanggan = data.namaPelanggan;
  if (data.noTelpPelanggan !== undefined) updateData.noTelpPelanggan = data.noTelpPelanggan;
  if (data.kategori !== undefined) updateData.kategori = data.kategori;
  if (data.tglBooking !== undefined) {
    updateData.tglBooking = new Date(data.tglBooking);
  }
  if (data.status !== undefined) {
    updateData.status = data.status;
    // Auto-set selesaiDi jika status SELESAI
    if (data.status === 'SELESAI') {
      updateData.selesaiDi = new Date();
    }
  }

  return prisma.booking.update({
    where: { id },
    data: updateData,
    include: {
      teknisi: { select: { id: true, nama: true } },
    },
  });
}

export async function hapusBooking(id: string, userRole: Role) {
  if (userRole === 'CUSTOMER' || userRole === 'TEKNISI') {
    throw new ForbiddenError('Kamu tidak bisa menghapus booking');
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new NotFoundError('Booking');

  await prisma.booking.delete({ where: { id } });
}
