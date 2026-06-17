# Plan: Estimasi Harga Section

## Tujuan
Menambahkan section baru "Estimasi Harga" di bawah section "Mengapa Memilih Kami" yang menampilkan:
- Range harga jasa: ~Rp 70.000 - Rp 150.000
- Pemberitahuan bahwa harga belum termasuk sparepart

## Lokasi Penempatan
Sesudah section `#ringkasan` (Mengapa Memilih Kami), sebelum section `#jenis-servis` (Layanan yang Tersedia)

## Desain yang Direkomendasikan

### Layout
- Card besar dengan background yang sama seperti card lainnya
- Posisi teks di center
- Include icon info (Info atau AlertCircle dari lucide-react)

### Komponen yang Dibutuhkan
```tsx
<SectionWrapper>
  <ContainerPublik>
    <section className="space-y-6" id="estimasi" data-reveal>
      <div className="kartu rounded-none p-7 text-center">
        <div className="flex flex-col items-center gap-3">
          <Info size={24} className="text-utama" />
          <h3 className="estimasi-heading">Estimasi Harga Jasa</h3>
          <p className="text-lg font-semibold text-teks">
            Rp 70.000 - Rp 150.000
          </p>
          <p className="text-sm text-redup max-w-md">
            *Harga belum termasuk pembelian sparepart
          </p>
        </div>
      </div>
    </section>
  </ContainerPublik>
</SectionWrapper>
```

## Langkah Implementasi

### 1. Edit `src/halaman/publik/Landing.tsx`
- Import icon `Info` dari lucide-react
- Tambahkan section baru di antara `#ringkasan` dan `#jenis-servis`

### 2. Kode yang Ditambahkan
Setelah line `</SectionWrapper>` yang menutup `#ringkasan`:

```tsx
<SectionWrapper>
  <ContainerPublik>
    <section className="space-y-6" id="estimasi" data-reveal>
      <div className="kartu rounded-none p-7 text-center">
        <div className="flex flex-col items-center gap-3">
          <Info size={24} className="text-utama" />
          <h3 className="estimasi-heading">Estimasi Harga Jasa</h3>
          <p className="text-lg font-semibold text-teks">
            Rp 70.000 - Rp 150.000
          </p>
          <p className="text-sm text-redup">
            *Harga belum termasuk pembelian sparepart
          </p>
        </div>
      </div>
    </section>
  </ContainerPublik>
</SectionWrapper>
```

## Estimasi Waktu
- 1 file (`Landing.tsx`)
- ~10 baris kode baru
- Tidak ada dependency baru

## Catatan
- Menggunakan CSS class `.estimasi-heading` yang sudah ada di styles.css
- Warna utama (hijau) untuk icon info
- Teks disclaimer menggunakan warna redup agar tidak terlalu mencolok
