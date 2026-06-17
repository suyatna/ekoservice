import { prisma } from '../../shared/prisma.js';
export async function getDashboardStats() {
    const now = new Date();
    const awalBulan = new Date(now.getFullYear(), now.getMonth(), 1);
    const awalMinggu = new Date(now);
    awalMinggu.setDate(now.getDate() - 7);
    // Booking aktif (tidak selesai/batal)
    const bookingAktif = await prisma.booking.count({
        where: {
            status: { notIn: ['SELESAI', 'DIBATALKAN_PELANGGAN', 'DIBATALKAN_ADMIN', 'DIBATALKAN_SISTEM'] },
        },
    });
    // Pendapatan bulan ini
    const pendapatan = await prisma.transaksi.aggregate({
        where: {
            jenis: 'MASUK',
            dibuatDi: { gte: awalBulan },
        },
        _sum: { nominal: true },
    });
    // Booking selesai bulan ini
    const bookingSelesai = await prisma.booking.count({
        where: {
            status: 'SELESAI',
            selesaiDi: { gte: awalBulan },
        },
    });
    // Total booking bulan ini (untuk SLA rate)
    const totalBookingBulan = await prisma.booking.count({
        where: { dibuatDi: { gte: awalBulan } },
    });
    const slaRate = totalBookingBulan > 0
        ? Math.round((bookingSelesai / totalBookingBulan) * 100)
        : 0;
    // Stok kritis
    const stokKritis = await prisma.sparepart.count({
        where: { stok: { lte: 2 } },
    });
    return {
        bookingAktif,
        pendapatanBulan: Number(pendapatan._sum.nominal ?? 0),
        slaRate,
        bookingSelesai,
        stokKritis,
    };
}
export async function getBookingChart(days = 5) {
    const result = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));
        const count = await prisma.booking.count({
            where: { dibuatDi: { gte: start, lte: end } },
        });
        result.push({
            tanggal: start.toISOString().split('T')[0],
            jumlah: count,
        });
    }
    return result;
}
export async function getPendapatanChart(bulan = 12) {
    const result = [];
    const now = new Date();
    for (let i = bulan - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const akhir = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const agg = await prisma.transaksi.aggregate({
            where: {
                jenis: 'MASUK',
                dibuatDi: { gte: date, lte: akhir },
            },
            _sum: { nominal: true },
        });
        result.push({
            bulan: date.toLocaleString('id-ID', { month: 'short', year: '2-digit' }),
            jumlah: Number(agg._sum.nominal ?? 0),
        });
    }
    return result;
}
//# sourceMappingURL=dashboard.service.js.map