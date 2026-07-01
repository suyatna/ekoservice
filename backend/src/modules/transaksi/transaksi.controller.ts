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
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);
    const userId = (request.user as { sub: string } | undefined)?.sub;
    const result = await buatTransaksi(parsed.data, userId);
    return reply.code(201).send(ok(result, request.requestId));
  }

  async daftar(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as Record<string, unknown>;
    const parsed = skemaTransaksiFilter.safeParse(query);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);
    const result = await daftarTransaksi(parsed.data);
    return reply.send(paginated(result.data, result.total, result.page, result.limit, request.requestId));
  }

  async ubah(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = skemaTransaksiUbah.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);
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
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);

    const result = await daftarTransaksi({ ...parsed.data, page: 1, limit: 1000 });
    const transaksi = result.data;

    const BLUE = '#3678F4';
    const GREEN = '#2CBF78';
    const RED = '#EF4444';
    const DARK = '#111719';
    const PANEL = '#1D2527';
    const PANEL_ALT = '#242E31';
    const TEXT = '#F4F7F8';
    const MUTED = '#8D9AA0';
    const BORDER = '#2A3639';

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    const PW = doc.page.width;
    const PH = doc.page.height;
    const PAGE_MARGIN = 40;
    const CW = PW - PAGE_MARGIN * 2;
    const paintBackground = () => doc.rect(0, 0, PW, PH).fill(DARK);
    paintBackground();

    // Header Bar
    doc.rect(0, 0, PW, 70).fill(PANEL);
    doc.rect(0, 68, PW, 2).fill(BLUE);
    doc.font('Helvetica-Bold').fontSize(22).fill(TEXT).text('EKOSERVICE', PAGE_MARGIN, 20);
    const subtitle = 'Laporan Keuangan';
    doc.font('Helvetica').fontSize(9).fill(MUTED).text(subtitle, PAGE_MARGIN, 46, { width: CW });
    const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const dtTxt = 'Dicetak: ' + dateStr;
    const dtW = doc.widthOfString(dtTxt);
    doc.fillColor(TEXT).fontSize(8).text(dtTxt, PW - PAGE_MARGIN - dtW, 46);

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
      doc.rect(cx, cardY, cardW, cardH).fill(PANEL).strokeColor(BORDER).lineWidth(0.5).stroke();
      doc.rect(cx, cardY, 3, cardH).fill(card.color);
      doc.fillColor(MUTED).font('Helvetica').fontSize(7).text(card.label.toUpperCase(), cx + 10, cardY + 12, { width: cardW - 20 });
      const valStr = 'Rp ' + Number(card.value).toLocaleString('id-ID');
      doc.fillColor(card.color).font('Helvetica-Bold').fontSize(15).text(valStr, cx + 10, cardY + 28, { width: cardW - 20 });
    });

    // Table
    const tblY = cardY + cardH + 16;
    const hdrH = 26;
    const rowH = 22;
    const cols = [84, CW - 84 - 72 - 100, 72, 100];
    const hdrs = ['Tanggal', 'Detail', 'Jenis', 'Nominal (Rp)'];

    doc.rect(PAGE_MARGIN, tblY, CW, hdrH).fill(BLUE);
    doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(8);
    let hx = PAGE_MARGIN + 8;
    hdrs.forEach((h, i) => { doc.text(h, hx, tblY + 9, { width: cols[i] - 8 }); hx += cols[i]; });

    let ry = tblY + hdrH;
    transaksi.forEach((t, idx) => {
      doc.rect(PAGE_MARGIN, ry, CW, rowH).fill(idx % 2 === 0 ? PANEL : PANEL_ALT);
      const tgl = new Date(t.dibuatDi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      const nominal = Number(t.nominal);
      const clr = t.jenis === 'MASUK' ? GREEN : RED;
      const label = t.jenis === 'MASUK' ? 'Masuk' : 'Keluar';
      const nominalStr = (t.jenis === 'MASUK' ? '+' : '-') + ' Rp ' + nominal.toLocaleString('id-ID');
      let rx = PAGE_MARGIN + 8;
      doc.fillColor(TEXT).font('Helvetica').fontSize(9).text(tgl, rx, ry + 6, { width: cols[0] - 8 }); rx += cols[0];
      doc.text(t.deskripsi || 'Tanpa detail', rx, ry + 6, { width: cols[1] - 8 }); rx += cols[1];
      doc.fillColor(clr).font('Helvetica-Bold').fontSize(8).text(label, rx, ry + 7, { width: cols[2] - 8 }); rx += cols[2];
      doc.fontSize(9).text(nominalStr, rx, ry + 6, { width: cols[3] - 8, align: 'right' });
      ry += rowH;
      if (ry > doc.page.height - 100) { doc.addPage({ margin: 0 }); paintBackground(); ry = 40; }
    });

    // Separator
    const sepY = ry + 6;
    doc.moveTo(PAGE_MARGIN, sepY).lineTo(PAGE_MARGIN + CW, sepY).strokeColor(BORDER).stroke();

    // Footer box
    const fy = sepY + 14;
    const fw = 200;
    const fh = 62;
    const fx = PW - PAGE_MARGIN - fw;
    doc.rect(fx, fy, fw, fh).fill(PANEL).strokeColor(BORDER).lineWidth(0.5).stroke();
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

    // Footer line
    const fLineY = fy + fh + 16;
    doc.moveTo(PAGE_MARGIN, fLineY).lineTo(PW - PAGE_MARGIN, fLineY).strokeColor(BORDER).stroke();
    doc.fillColor(MUTED).font('Helvetica').fontSize(7)
      .text('EkoService | Laporan Keuangan', PAGE_MARGIN, fLineY + 8)
      .text('Halaman 1 dari 1', PW - PAGE_MARGIN - 60, fLineY + 8);

    reply.raw.setHeader('Content-Type', 'application/pdf');
    reply.raw.setHeader('Content-Disposition', `attachment; filename="laporan-keuangan-${new Date().toISOString().split('T')[0]}.pdf"`);
    doc.pipe(reply.raw);
    doc.end();
    return reply;
  }
}

export const transaksiController = new TransaksiController();
