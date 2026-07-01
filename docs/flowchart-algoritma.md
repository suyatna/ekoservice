# Flowchart Frontend EkoService

Dokumen ini memakai gaya flowchart klasik seperti contoh: `Mulai` dan `Selesai` sebagai terminal, proses sebagai kotak, dan kondisi sebagai decision.

Saat menyalin ke Mermaid editor, copy isi di dalam blok diagram saja, mulai dari `flowchart TD`.

## Flow Login Admin

```mermaid
flowchart TD
    A([MULAI]) --> B[Input Email dan Password]
    B --> C[Validasi Data Login]
    C --> D{Data Valid?}
    D -->|Tidak| E[Tampil Error]
    E --> B
    D -->|Ya| F[Masuk Dashboard Admin]
    F --> G([SELESAI])
```

## Flow Customer Booking via WhatsApp

```mermaid
flowchart TD
    A([MULAI]) --> B[Buka Website EkoService]
    B --> C[Klik Booking Sekarang]
    C --> D[Buka Halaman Booking Publik]
    D --> E[Tampil Nomor Admin dan Tombol Chat]
    E --> F[Klik Chat Sekarang]
    F --> G[Buka WhatsApp Admin]
    G --> H[Teks Awal Booking Terisi Otomatis]
    H --> I[Customer Chat dengan Admin]
    I --> J([SELESAI])
```

## Flow Admin Mencatat Booking

```mermaid
flowchart TD
    A([MULAI]) --> B[Terima Chat Booking dari WhatsApp]
    B --> C[Admin Login Dashboard]
    C --> D[Buka Menu Booking]
    D --> E[Klik Tombol Tambah]
    E --> F[Input Data Customer]
    F --> G[Input Jenis Service]
    G --> H[Input Tanggal Booking]
    H --> I[Input Nomor WhatsApp]
    I --> J[Pilih Status Booking]
    J --> K{Data Wajib Lengkap?}
    K -->|Tidak| L[Tampil Error]
    L --> F
    K -->|Ya| M[Simpan Booking]
    M --> N{Berhasil Disimpan?}
    N -->|Tidak| O[Tampil Error]
    O --> F
    N -->|Ya| P[Reload Daftar Booking]
    P --> Q[Tampil Pesan Booking Dibuat]
    Q --> R([SELESAI])
```

## Flow Cari dan Filter Booking

```mermaid
flowchart TD
    A([MULAI]) --> B[Buka Menu Booking]
    B --> C[Ambil Daftar Booking]
    C --> D{Data Sedang Dimuat?}
    D -->|Ya| E[Tampil Loading]
    E --> C
    D -->|Tidak| F{Data Gagal Dimuat?}
    F -->|Ya| G[Tampil Error]
    G --> H([SELESAI])
    F -->|Tidak| I{Data Booking Ada?}
    I -->|Tidak| J[Tampil Data Kosong]
    J --> H
    I -->|Ya| K[Tampil Tabel Booking]
    K --> L{Admin Ubah Pencarian atau Filter?}
    L -->|Ya| C
    L -->|Tidak| H
```

## Flow Edit atau Hapus Booking

```mermaid
flowchart TD
    A([MULAI]) --> B[Buka Menu Booking]
    B --> C[Pilih Data Booking]
    C --> D[Edit Field Booking]
    D --> E{Field Utama Kosong?}
    E -->|Ya| F[Hapus Booking]
    E -->|Tidak| G[Susun Data Perubahan]
    G --> H[Update Booking]
    F --> I{Proses Berhasil?}
    H --> I
    I -->|Tidak| J[Tampil Error]
    J --> K([SELESAI])
    I -->|Ya| L[Reload Daftar Booking]
    L --> M[Tampil Pesan Sukses]
    M --> K
```

## Flow Keuangan

```mermaid
flowchart TD
    A([MULAI]) --> B[Buka Menu Keuangan]
    B --> C[Ambil Daftar Transaksi]
    C --> D[Tampil Tabel Transaksi]
    D --> E{Pilih Aksi}
    E -->|Cari atau Filter| C
    E -->|Tambah| F[Tampil Baris Transaksi Baru]
    F --> G[Input Detail dan Nominal]
    G --> H{Data Valid?}
    H -->|Tidak| I[Tampil Error]
    I --> G
    H -->|Ya| J[Simpan Transaksi]
    J --> K[Reload Daftar Transaksi]
    E -->|Edit| L[Edit Data Transaksi]
    L --> M{Field Utama Kosong?}
    M -->|Ya| N[Hapus Transaksi]
    M -->|Tidak| O[Update Transaksi]
    N --> K
    O --> K
    E -->|Export PDF| P[Ambil File PDF]
    P --> Q[Download Laporan PDF]
    K --> R([SELESAI])
    Q --> R
```

## Flow Stok Sparepart

```mermaid
flowchart TD
    A([MULAI]) --> B[Buka Menu Stok]
    B --> C[Ambil Daftar Sparepart]
    C --> D{Data Berhasil Dimuat?}
    D -->|Tidak| E[Tampil Error]
    E --> F([SELESAI])
    D -->|Ya| G[Tampil Tabel Sparepart]
    G --> H{Pilih Aksi}
    H -->|Cari atau Filter| C
    H -->|Tambah| I[Tampil Baris Sparepart Baru]
    I --> J[Input Nama Stok dan Satuan]
    J --> K{Data Lengkap?}
    K -->|Tidak| L[Tampil Error]
    L --> J
    K -->|Ya| M[Simpan Sparepart]
    M --> N[Reload Daftar Sparepart]
    H -->|Edit| O[Edit Data Sparepart]
    O --> P{Field Utama Kosong?}
    P -->|Ya| Q[Hapus Sparepart]
    P -->|Tidak| R[Update Sparepart]
    Q --> N
    R --> N
    N --> F
```

## Flow Logout Admin

```mermaid
flowchart TD
    A([MULAI]) --> B[Klik Logout]
    B --> C[Proses Logout]
    C --> D[Kosongkan Data Admin]
    D --> E[Set Status Belum Login]
    E --> F[Tampil Pesan Keluar]
    F --> G([SELESAI])
```
