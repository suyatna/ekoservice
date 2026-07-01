# sequence diagram ekoservice

diagram ini dibuat sederhana: customer booking lewat whatsapp, lalu admin mencatat dan mengelola data di sistem.

saat menyalin ke mermaid editor, copy isi di dalam blok diagram saja, mulai dari `sequenceDiagram`.

## sequence diagram utama

```mermaid
%%{init: {"theme": "base", "themeVariables": {"actorBkg": "#dbeafe", "actorBorder": "#2563eb", "actorTextColor": "#0f172a", "activationBkgColor": "#bbf7d0", "activationBorderColor": "#16a34a", "sequenceNumberColor": "#0f172a", "signalColor": "#334155", "signalTextColor": "#0f172a", "noteBkgColor": "#fef3c7", "noteTextColor": "#0f172a", "labelBoxBkgColor": "#f8fafc", "labelBoxBorderColor": "#94a3b8", "loopTextColor": "#0f172a"}}}%%
sequenceDiagram
    autonumber
    actor customer
    participant web as website
    participant wa as whatsapp
    actor admin
    participant system as sistem ekoservice
    participant db as database

    customer->>web: buka website
    web-->>customer: tampilkan landing page
    note over customer,web: customer melihat informasi layanan
    customer->>web: klik booking sekarang
    web-->>customer: tampilkan halaman booking
    customer->>web: klik chat sekarang
    web->>wa: buka chat admin
    wa-->>customer: tampilkan chat whatsapp
    customer->>admin: kirim data booking

    admin->>system: login admin
    system->>db: validasi akun admin
    db-->>system: data admin valid
    system-->>admin: masuk dashboard
    note over admin,system: admin masuk ke dashboard

    admin->>system: input data booking
    system->>db: simpan booking
    db-->>system: booking tersimpan
    system-->>admin: tampilkan daftar booking terbaru
    note over system,db: data booking tersimpan di database

    admin->>system: kelola booking, keuangan, atau stok
    system->>db: simpan perubahan data
    db-->>system: data berhasil diperbarui
    system-->>admin: tampilkan hasil proses

    admin->>system: logout
    system-->>admin: keluar dari dashboard
```
