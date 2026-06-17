import { prisma } from '../../shared/prisma.js';
import { generateSparepartId, generateUUID } from '../../shared/id-generator.js';
import { NotFoundError } from '../../shared/errors.js';
import { SkemaSparepartBuat, SkemaSparepartUbah, SkemaSparepartFilter } from './sparepart.schemas.js';
import { Decimal } from '@prisma/client/runtime/library';

export async function buatSparepart(data: SkemaSparepartBuat) {
  return prisma.sparepart.create({
    data: {
      id: generateUUID(),
      idTampilan: generateSparepartId(),
      nama: data.nama,
      kategori: data.kategori,
      stok: data.stok,
      stokMinimal: data.stokMinimal,
      satuan: data.satuan,
      hargaBeli: data.hargaBeli != null ? new Decimal(data.hargaBeli) : null,
    },
  });
}

export async function daftarSparepart(filter: SkemaSparepartFilter) {
  const { page, limit, search, kategori, stokLevel } = filter;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { idTampilan: { contains: search, mode: 'insensitive' } },
      { nama: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (kategori) where.kategori = kategori;
  if (stokLevel !== 'ALL') {
    if (stokLevel === 'HAMPA') where.stok = 0;
    else if (stokLevel === 'KRITIS') where.stok = { lte: 2, gte: 1 };
    else if (stokLevel === 'AMAN') where.stok = { gt: 2 };
  }

  const [data, total] = await Promise.all([
    prisma.sparepart.findMany({
      where,
      skip,
      take: limit,
      orderBy: { nama: 'asc' },
    }),
    prisma.sparepart.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function ubahSparepart(id: string, data: SkemaSparepartUbah) {
  const existing = await prisma.sparepart.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Sparepart');

  return prisma.sparepart.update({
    where: { id },
    data: {
      ...(data.nama !== undefined ? { nama: data.nama } : {}),
      ...(data.kategori !== undefined ? { kategori: data.kategori } : {}),
      ...(data.stok !== undefined ? { stok: data.stok } : {}),
      ...(data.stokMinimal !== undefined ? { stokMinimal: data.stokMinimal } : {}),
      ...(data.satuan !== undefined ? { satuan: data.satuan } : {}),
      ...(data.hargaBeli !== undefined ? { hargaBeli: data.hargaBeli != null ? new Decimal(data.hargaBeli) : null } : {}),
    },
  });
}

export async function hapusSparepart(id: string) {
  const existing = await prisma.sparepart.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Sparepart');
  await prisma.sparepart.delete({ where: { id } });
}

export async function getStokWarning() {
  return prisma.sparepart.findMany({
    where: { stok: { lte: 2 } },
    orderBy: { stok: 'asc' },
    select: { id: true, idTampilan: true, nama: true, kategori: true, stok: true, stokMinimal: true },
  });
}
