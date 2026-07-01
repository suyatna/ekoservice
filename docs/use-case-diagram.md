# Use Case Diagram EkoService

Dokumen ini menggambarkan aktor dan fitur utama pada frontend EkoService. Customer hanya melakukan booking lewat WhatsApp. Admin mengelola data dari dashboard.

Saat menyalin ke Mermaid editor, copy isi di dalam blok diagram saja, mulai dari `flowchart LR`.

## Use Case Diagram

```mermaid
flowchart LR
    Customer[Customer]
    Admin[Admin]

    subgraph Sistem["Sistem EkoService"]
        UC1([Melihat Landing Page])
        UC2([Melihat Informasi Layanan])
        UC3([Melihat Testimoni])
        UC4([Melihat Lokasi])
        UC5([Booking via WhatsApp])

        UC6([Login Admin])
        UC7([Mengelola Booking])
        UC8([Mencatat Booking dari WhatsApp])
        UC9([Mencari dan Filter Booking])
        UC10([Mengubah Status Booking])
        UC11([Menghapus Booking])

        UC12([Mengelola Keuangan])
        UC13([Mencatat Transaksi])
        UC14([Mengubah Transaksi])
        UC15([Menghapus Transaksi])
        UC16([Export Laporan PDF])

        UC17([Mengelola Stok Sparepart])
        UC18([Menambah Sparepart])
        UC19([Mengubah Sparepart])
        UC20([Menghapus Sparepart])

        UC21([Logout Admin])
    end

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5

    Admin --> UC6
    Admin --> UC7
    Admin --> UC12
    Admin --> UC17
    Admin --> UC21

    UC7 --> UC8
    UC7 --> UC9
    UC7 --> UC10
    UC7 --> UC11

    UC12 --> UC13
    UC12 --> UC14
    UC12 --> UC15
    UC12 --> UC16

    UC17 --> UC18
    UC17 --> UC19
    UC17 --> UC20
```
