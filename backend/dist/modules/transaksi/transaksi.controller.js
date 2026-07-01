import { fromZodError } from 'zod-validation-error';
import { buatTransaksi, daftarTransaksi, ubahTransaksi, hapusTransaksi, } from './transaksi.service.js';
import { skemaTransaksiBuat, skemaTransaksiUbah, skemaTransaksiFilter } from './transaksi.schemas.js';
import { ok, paginated } from '../../shared/response.js';
import { ValidationError } from '../../shared/errors.js';
import PDFDocument from 'pdfkit';
export class TransaksiController {
    async buat(request, reply) {
        const parsed = skemaTransaksiBuat.safeParse(request.body);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const userId = request.user?.sub;
        const result = await buatTransaksi(parsed.data, userId);
        return reply.code(201).send(ok(result, request.requestId));
    }
    async daftar(request, reply) {
        const query = request.query;
        const parsed = skemaTransaksiFilter.safeParse(query);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const result = await daftarTransaksi(parsed.data);
        return reply.send(paginated(result.data, result.total, result.page, result.limit, request.requestId));
    }
    async ubah(request, reply) {
        const parsed = skemaTransaksiUbah.safeParse(request.body);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const result = await ubahTransaksi(request.params.id, parsed.data);
        return reply.send(ok(result, request.requestId));
    }
    async hapus(request, reply) {
        await hapusTransaksi(request.params.id);
        return reply.code(204).send();
    }
    async exportPdf(request, reply) {
        const query = request.query;
        const parsed = skemaTransaksiFilter.safeParse(query);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const result = await daftarTransaksi({ ...parsed.data, page: 1, limit: 1000 });
        const transaksi = result.data;
        const BLUE = '#3678F4';
        const GREEN = '#2CBF78';
        const RED = '#EF4444';
        const INK = '#111719';
        const TEXT = '#2A3438';
        const MUTED = '#6B7780';
        const PAPER = '#FFFFFF';
        const SOFT = '#F5F7F9';
        const LINE = '#D8E0E5';
        const HEAD = '#EAF1FF';
        const doc = new PDFDocument({ margin: 0, size: 'A4' });
        const PW = doc.page.width;
        const PH = doc.page.height;
        const PAGE_MARGIN = 42;
        const CW = PW - PAGE_MARGIN * 2;
        const paintBackground = () => doc.rect(0, 0, PW, PH).fill(PAPER);
        paintBackground();
        doc.font('Helvetica-Bold').fontSize(20).fillColor(INK).text('EKO SERVICE', PAGE_MARGIN, 36);
        doc.font('Helvetica').fontSize(9).fillColor(MUTED).text('Laporan Keuangan', PAGE_MARGIN, 61);
        const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
        const dtTxt = 'Tanggal cetak: ' + dateStr;
        const dtW = doc.widthOfString(dtTxt);
        doc.fillColor(MUTED).fontSize(8).text(dtTxt, PW - PAGE_MARGIN - dtW, 42);
        doc.moveTo(PAGE_MARGIN, 82).lineTo(PW - PAGE_MARGIN, 82).strokeColor(LINE).lineWidth(1).stroke();
        // Summary cards
        let totalMasuk = 0;
        let totalKeluar = 0;
        transaksi.forEach((t) => { if (t.jenis === 'MASUK')
            totalMasuk += Number(t.nominal);
        else
            totalKeluar += Number(t.nominal); });
        const saldo = totalMasuk - totalKeluar;
        const cardY = 104;
        const cardH = 58;
        const cardW = (CW - 20) / 3;
        const cardGap = 10;
        const cards = [
            { label: 'Total Pemasukan', value: totalMasuk, color: GREEN },
            { label: 'Total Pengeluaran', value: totalKeluar, color: RED },
            { label: 'Saldo', value: saldo, color: saldo >= 0 ? GREEN : RED },
        ];
        cards.forEach((card, i) => {
            const cx = PAGE_MARGIN + i * (cardW + cardGap);
            doc.rect(cx, cardY, cardW, cardH).fill(SOFT).strokeColor(LINE).lineWidth(0.6).stroke();
            doc.rect(cx, cardY, 3, cardH).fill(card.color);
            doc.fillColor(MUTED).font('Helvetica').fontSize(7).text(card.label.toUpperCase(), cx + 12, cardY + 13, { width: cardW - 24 });
            const valStr = 'Rp ' + Number(card.value).toLocaleString('id-ID');
            doc.fillColor(card.color).font('Helvetica-Bold').fontSize(15).text(valStr, cx + 12, cardY + 31, { width: cardW - 24 });
        });
        const tblY = cardY + cardH + 30;
        const hdrH = 24;
        const rowH = 22;
        const cols = [84, CW - 84 - 72 - 100, 72, 100];
        const hdrs = ['Tanggal', 'Detail', 'Jenis', 'Nominal (Rp)'];
        const drawTableHeader = (y) => {
            doc.rect(PAGE_MARGIN, y, CW, hdrH).fill(HEAD).strokeColor(LINE).lineWidth(0.6).stroke();
            doc.fillColor(INK).font('Helvetica-Bold').fontSize(8);
            let hx = PAGE_MARGIN + 8;
            hdrs.forEach((h, i) => {
                doc.text(h, hx, y + 8, { width: cols[i] - 8 });
                hx += cols[i];
            });
        };
        drawTableHeader(tblY);
        let ry = tblY + hdrH;
        transaksi.forEach((t, idx) => {
            doc.rect(PAGE_MARGIN, ry, CW, rowH).fill(idx % 2 === 0 ? PAPER : SOFT);
            doc.moveTo(PAGE_MARGIN, ry + rowH).lineTo(PAGE_MARGIN + CW, ry + rowH).strokeColor(LINE).lineWidth(0.4).stroke();
            const tgl = new Date(t.dibuatDi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            const nominal = Number(t.nominal);
            const clr = t.jenis === 'MASUK' ? GREEN : RED;
            const label = t.jenis === 'MASUK' ? 'Masuk' : 'Keluar';
            const nominalStr = (t.jenis === 'MASUK' ? '+' : '-') + ' Rp ' + nominal.toLocaleString('id-ID');
            let rx = PAGE_MARGIN + 8;
            doc.fillColor(TEXT).font('Helvetica').fontSize(9).text(tgl, rx, ry + 6, { width: cols[0] - 8 });
            rx += cols[0];
            doc.text(t.deskripsi || 'Tidak ada detail', rx, ry + 6, { width: cols[1] - 8 });
            rx += cols[1];
            doc.fillColor(clr).font('Helvetica-Bold').fontSize(8).text(label, rx, ry + 7, { width: cols[2] - 8 });
            rx += cols[2];
            doc.fontSize(9).text(nominalStr, rx, ry + 6, { width: cols[3] - 8, align: 'right' });
            ry += rowH;
            if (ry > doc.page.height - 105) {
                doc.addPage({ margin: 0 });
                paintBackground();
                ry = 42;
                drawTableHeader(ry);
                ry += hdrH;
            }
        });
        const sepY = ry + 6;
        doc.moveTo(PAGE_MARGIN, sepY).lineTo(PAGE_MARGIN + CW, sepY).strokeColor(LINE).stroke();
        const fy = sepY + 14;
        const fw = 200;
        const fh = 62;
        const fx = PW - PAGE_MARGIN - fw;
        doc.rect(fx, fy, fw, fh).fill(SOFT).strokeColor(LINE).lineWidth(0.6).stroke();
        doc.fillColor(MUTED).font('Helvetica').fontSize(9)
            .text('Total Masuk', fx + 10, fy + 10)
            .text('Total Keluar', fx + 10, fy + 28)
            .text('Saldo', fx + 10, fy + 46);
        doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(10)
            .text('Rp ' + totalMasuk.toLocaleString('id-ID'), fx + 10, fy + 10, { align: 'right', width: fw - 20 })
            .fillColor(RED)
            .text('Rp ' + totalKeluar.toLocaleString('id-ID'), fx + 10, fy + 28, { align: 'right', width: fw - 20 })
            .fillColor(saldo >= 0 ? GREEN : RED)
            .text('Rp ' + saldo.toLocaleString('id-ID'), fx + 10, fy + 46, { align: 'right', width: fw - 20 });
        const fLineY = fy + fh + 16;
        doc.moveTo(PAGE_MARGIN, fLineY).lineTo(PW - PAGE_MARGIN, fLineY).strokeColor(LINE).stroke();
        doc.fillColor(MUTED).font('Helvetica').fontSize(7)
            .text('Halaman 1 dari 1', PW - PAGE_MARGIN - 60, fLineY + 8);
        reply.raw.setHeader('Content-Type', 'application/pdf');
        reply.raw.setHeader('Content-Disposition', `attachment; filename="laporan-keuangan-${new Date().toISOString().split('T')[0]}.pdf"`);
        doc.pipe(reply.raw);
        doc.end();
        return reply;
    }
}
export const transaksiController = new TransaksiController();
//# sourceMappingURL=transaksi.controller.js.map