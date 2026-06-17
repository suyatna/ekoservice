import { prisma } from '../../shared/prisma.js';
import { generateTransaksiId, generateUUID } from '../../shared/id-generator.js';
import { NotFoundError } from '../../shared/errors.js';
import { SkemaTransaksiBuat, SkemaTransaksiUbah, SkemaTransaksiFilter } from './transaksi.schemas.js';
import { Decimal } from '@prisma/client/runtime/library';

export async function buatTransaksi(data: SkemaTransaksiBuat) {
  return prisma.transaksi.create({
    data: {
      id: generateUUID(),
      idTampilan: generateTransaksiId(),
      deskripsi: data.deskripsi,
      jenis: data.jenis,
      nominal: new Decimal(data.nominal),
      metodeBayar: data.metodeBayar ?? null,
      bookingId: data.bookingId ?? null,
    },
  });
}

export async function daftarTransaksi(filter: SkemaTransaksiFilter) {
  const { page, limit, search, jenis, dari, sampai } = filter;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { idTampilan: { contains: search, mode: 'insensitive' } },
      { deskripsi: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (jenis) where.jenis = jenis;
  if (dari || sampai) {
    where.dibuatDi = {
      ...(dari ? { gte: new Date(dari) } : {}),
      ...(sampai ? { lte: new Date(sampai) } : {}),
    };
  }

  const [data, total] = await Promise.all([
    prisma.transaksi.findMany({
      where,
      skip,
      take: limit,
      orderBy: { dibuatDi: 'desc' },
      include: { booking: { select: { id: true, idTampilan: true, namaPelanggan: true } } },
    }),
    prisma.transaksi.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function ubahTransaksi(id: string, data: SkemaTransaksiUbah) {
  const existing = await prisma.transaksi.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Transaksi');

  return prisma.transaksi.update({
    where: { id },
    data: {
      ...(data.deskripsi !== undefined ? { deskripsi: data.deskripsi } : {}),
      ...(data.nominal !== undefined ? { nominal: new Decimal(data.nominal) } : {}),
      ...(data.metodeBayar !== undefined ? { metodeBayar: data.metodeBayar } : {}),
    },
  });
}

export async function hapusTransaksi(id: string) {
  const existing = await prisma.transaksi.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Transaksi');
  await prisma.transaksi.delete({ where: { id } });
}

export async function getStatistikKeuangan(dari?: string, sampai?: string) {
  const where: Record<string, unknown> = {};
  if (dari || sampai) {
    where.dibuatDi = {
      ...(dari ? { gte: new Date(dari) } : {}),
      ...(sampai ? { lte: new Date(sampai) } : {}),
    };
  }

  const [transaksi, total] = await Promise.all([
    prisma.transaksi.findMany({
      where,
      orderBy: { dibuatDi: 'desc' },
      select: { nominal: true, jenis: true, dibuatDi: true },
    }),
    prisma.transaksi.count({ where }),
  ]);

  const totalMasuk = transaksi
    .filter((t) => t.jenis === 'MASUK')
    .reduce((sum, t) => sum + Number(t.nominal), 0);

  const totalKeluar = transaksi
    .filter((t) => t.jenis === 'KELUAR')
    .reduce((sum, t) => sum + Number(t.nominal), 0);

  return {
    totalTransaksi: total,
    totalMasuk,
    totalKeluar,
    saldo: totalMasuk - totalKeluar,
  };
}
