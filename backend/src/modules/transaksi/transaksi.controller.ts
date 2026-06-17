import { FastifyRequest, FastifyReply } from 'fastify';
import { fromZodError } from 'zod-validation-error';
import {
  buatTransaksi, daftarTransaksi, ubahTransaksi, hapusTransaksi,
} from './transaksi.service.js';
import { skemaTransaksiBuat, skemaTransaksiUbah, skemaTransaksiFilter } from './transaksi.schemas.js';
import { ok, paginated } from '../../shared/response.js';
import { ValidationError } from '../../shared/errors.js';
import PDFDocument from 'pdfkit';

export class TransaksiController {
  async buat(request: FastifyRequest, reply: FastifyReply) {
    const parsed = skemaTransaksiBuat.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error).message);
    const result = await buatTransaksi(parsed.data);
    return reply.code(201).send(ok(result, request.requestId));
  }

  async daftar(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as Record<string, unknown>;
    const parsed = skemaTransaksiFilter.safeParse(query);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error).message);
    const result = await daftarTransaksi(parsed.data);
    return reply.send(paginated(result.data, result.total, result.page, result.limit, request.requestId));
  }

  async ubah(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = skemaTransaksiUbah.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error).message);
    const result = await ubahTransaksi(request.params.id, parsed.data);
    return reply.send(ok(result, request.requestId));
  }

  async hapus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await hapusTransaksi(request.params.id);
    return reply.code(204).send();
  }

  async exportPdf(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as Record<string, unknown>;
    const parsed = skemaTransaksiFilter.safeParse(query);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error).message);

    const result = await daftarTransaksi({ ...parsed.data, page: 1, limit: 1000 });
    const transaksi = result.data;

    const GREEN = '#16A34A';
    const RED = '#DC2626';
    const DARK = '#1F2937';
    const GRAY = '#6B7280';
    const LIGHT_BG = '#F9FAFB';
    const WHITE = '#FFFFFF';
    const BORDER = '#E5E7EB';

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    const PW = doc.page.width;
    const PAGE_MARGIN = 40;
    const CW = PW - PAGE_MARGIN * 2;

    // Header Bar
    doc.rect(0, 0, PW, 70).fill(GREEN);
    doc.font('Helvetica-Bold').fontSize(22).fill(WHITE).text('EKOSERVICE', PAGE_MARGIN, 20);
    const subtitle = 'Laporan Keuangan';
    doc.font('Helvetica').fontSize(9).fill('rgba(255,255,255,0.8)').text(subtitle, PAGE_MARGIN, 46, { width: CW });
    const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const dtTxt = 'Dicetak: ' + dateStr;
    const dtW = doc.widthOfString(dtTxt);
    doc.fillColor(WHITE).fontSize(8).text(dtTxt, PW - PAGE_MARGIN - dtW, 46);

    // Summary cards
    let totalMasuk = 0;
    let totalKeluar = 0;
    transaksi.forEach((t) => { if (t.jenis === 'MASUK') totalMasuk += Number(t.nominal); else totalKeluar += Number(t.nominal); });
    const saldo = totalMasuk - totalKeluar;
    const cardY = 85;
    const cardH = 56;
    const cardW = (CW - 12) / 3;
    const cardGap = 6;
    const cards = [
      { label: 'Total Pemasukan', value: totalMasuk, color: GREEN },
      { label: 'Total Pengeluaran', value: totalKeluar, color: RED },
      { label: 'Saldo', value: saldo, color: DARK },
    ];

    cards.forEach((card, i) => {
      const cx = PAGE_MARGIN + i * (cardW + cardGap);
      doc.rect(cx, cardY, cardW, cardH).fill(WHITE).stroke(BORDER, 0.5);
      doc.rect(cx, cardY, 3, cardH).fill(GREEN);
      doc.fillColor(GRAY).font('Helvetica').fontSize(7).text(card.label.toUpperCase(), cx + 10, cardY + 12, { width: cardW - 20 });
      const valStr = 'Rp ' + Number(card.value).toLocaleString('id-ID');
      doc.fillColor(card.color).font('Helvetica-Bold').fontSize(15).text(valStr, cx + 10, cardY + 28, { width: cardW - 20 });
    });

    // Table
    const tblY = cardY + cardH + 16;
    const hdrH = 26;
    const rowH = 22;
    const cols = [84, CW - 84 - 72 - 100, 72, 100];
    const hdrs = ['Tanggal', 'Detail', 'Jenis', 'Nominal (Rp)'];

    doc.rect(PAGE_MARGIN, tblY, CW, hdrH).fill(GREEN);
    doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(8);
    let hx = PAGE_MARGIN + 8;
    hdrs.forEach((h, i) => { doc.text(h, hx, tblY + 9, { width: cols[i] - 8 }); hx += cols[i]; });

    let ry = tblY + hdrH;
    transaksi.forEach((t, idx) => {
      if (idx % 2 === 0) doc.rect(PAGE_MARGIN, ry, CW, rowH).fill(LIGHT_BG);
      const tgl = new Date(t.dibuatDi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      const nominal = Number(t.nominal);
      const clr = t.jenis === 'MASUK' ? GREEN : RED;
      const label = t.jenis === 'MASUK' ? 'Masuk' : 'Keluar';
      const nominalStr = (t.jenis === 'MASUK' ? '+' : '-') + ' Rp ' + nominal.toLocaleString('id-ID');
      let rx = PAGE_MARGIN + 8;
      doc.fillColor(DARK).font('Helvetica').fontSize(9).text(tgl, rx, ry + 6, { width: cols[0] - 8 }); rx += cols[0];
      doc.text(t.deskripsi || '-', rx, ry + 6, { width: cols[1] - 8 }); rx += cols[1];
      doc.fillColor(clr).font('Helvetica-Bold').fontSize(8).text(label, rx, ry + 7, { width: cols[2] - 8 }); rx += cols[2];
      doc.fontSize(9).text(nominalStr, rx, ry + 6, { width: cols[3] - 8, align: 'right' });
      ry += rowH;
      if (ry > doc.page.height - 100) { doc.addPage({ margin: 0 }); ry = 40; }
    });

    // Separator
    const sepY = ry + 6;
    doc.moveTo(PAGE_MARGIN, sepY).lineTo(PAGE_MARGIN + CW, sepY).stroke(BORDER);

    // Footer box
    const fy = sepY + 14;
    const fw = 200;
    const fh = 62;
    const fx = PW - PAGE_MARGIN - fw;
    doc.rect(fx, fy, fw, fh).fill(LIGHT_BG).stroke(BORDER, 0.5);
    doc.fillColor(GRAY).font('Helvetica').fontSize(9)
      .text('Total Masuk', fx + 10, fy + 10)
      .text('Total Keluar', fx + 10, fy + 28)
      .text('Saldo', fx + 10, fy + 46);
    doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(10)
      .text('Rp ' + totalMasuk.toLocaleString('id-ID'), fx + 10, fy + 10, { align: 'right', width: fw - 20 })
      .fillColor(RED)
      .text('Rp ' + totalKeluar.toLocaleString('id-ID'), fx + 10, fy + 28, { align: 'right', width: fw - 20 })
      .fillColor(saldo >= 0 ? GREEN : RED)
      .text('Rp ' + saldo.toLocaleString('id-ID'), fx + 10, fy + 46, { align: 'right', width: fw - 20 });

    // Footer line
    const fLineY = fy + fh + 16;
    doc.moveTo(PAGE_MARGIN, fLineY).lineTo(PW - PAGE_MARGIN, fLineY).stroke(BORDER);
    doc.fillColor(GRAY).font('Helvetica').fontSize(7)
      .text('EkoService — Laporan Keuangan', PAGE_MARGIN, fLineY + 8)
      .text('Halaman 1 dari 1', PW - PAGE_MARGIN - 60, fLineY + 8);

    reply.raw.setHeader('Content-Type', 'application/pdf');
    reply.raw.setHeader('Content-Disposition', `attachment; filename="laporan-keuangan-${new Date().toISOString().split('T')[0]}.pdf"`);
    doc.pipe(reply.raw);
    doc.end();
    return reply;
  }
}

export const transaksiController = new TransaksiController();