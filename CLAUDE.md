# Ekoservice Context

Ini repo untuk Ekoservice, layanan servis elektronik.

Yang aktif sekarang:
- Landing page publik
- Booking lewat WhatsApp dari halaman publik
- Login admin untuk lihat dan kelola booking, keuangan, dan stok

Yang jangan diperlakukan sebagai flow produk utama:
- Alur servis teknisi berlapis 16 status
- Booking in-app untuk pelanggan
- Role finance, warehouse, teknisi, dan super admin masih ada di kode lama, tapi jangan diperlakukan sebagai flow utama tanpa cek source

Kalau menjelaskan project ini, pakai sumber berikut dulu:
- `frontend/src/halaman/publik/BookingPublik.tsx`
- `frontend/src/halaman/publik/Landing.tsx`
- `frontend/src/halaman/admin/HalamanBooking.tsx`
- `frontend/src/halaman/admin/HalamanKeuangan.tsx`
- `frontend/src/halaman/admin/HalamanStok.tsx`
- `backend/src/modules/auth`
- `backend/src/modules/booking`

Kalau ada file schema, seed, atau komentar lama yang masih memuat role/status lama, anggap itu legacy kecuali user minta bahas kode historisnya.
