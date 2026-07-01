import { prisma } from '../../shared/prisma.js';
import { generateBookingId, generateUUID } from '../../shared/id-generator.js';
import { NotFoundError } from '../../shared/errors.js';
import { SkemaBookingBuat, SkemaBookingUbah, SkemaBookingFilter } from './booking.schemas.js';

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
      kategori: data.kategori,
      tglBooking: data.tglBooking ? new Date(data.tglBooking) : new Date(),
      dibuatOleh: { connect: { id: dibuatOlehId } },
      status: data.status ?? 'MENUNGGU',
    },
  });
}

export async function daftarBooking(filter: SkemaBookingFilter) {
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

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { dibuatDi: 'desc' },
      include: {
        dibuatOleh: { select: { id: true, nama: true } },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getBookingById(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      dibuatOleh: { select: { id: true, nama: true } },
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking');
  }

  return booking;
}

export async function ubahBooking(id: string, data: SkemaBookingUbah) {
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Booking');

  const updateData: Record<string, unknown> = {};

  if (data.namaPelanggan !== undefined) updateData.namaPelanggan = data.namaPelanggan;
  if (data.noTelpPelanggan !== undefined) updateData.noTelpPelanggan = data.noTelpPelanggan;
  if (data.kategori !== undefined) updateData.kategori = data.kategori;
  if (data.tglBooking !== undefined) {
    updateData.tglBooking = new Date(data.tglBooking);
  }
  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  return prisma.booking.update({
    where: { id },
    data: updateData,
  });
}

export async function hapusBooking(id: string) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new NotFoundError('Booking');

  await prisma.booking.delete({ where: { id } });
}
