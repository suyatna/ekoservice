# Ekoservice Frontend

Frontend production-ready untuk platform servis elektronik Ekoservice (React + Vite + TypeScript).

## Fitur
- Landing page publik
- Booking lewat WhatsApp
- Autentikasi admin + route guard
- Dashboard admin untuk booking, keuangan, dan stok
- Grafik ringkasan Recharts
- Validasi form React Hook Form + Zod
- State ringan Zustand
- API client siap integrasi (`VITE_API_BASE_URL`)
- Toast notifikasi Sonner
- Komponen reusable lengkap (kartu, tabel, badge status, modal, skeleton, empty/error state)

## Menjalankan Lokal
```bash
npm install
npm run dev
```

## Build Produksi
```bash
npm run build
npm run preview
```

## Docker
```bash
docker build -t ekoservice-frontend .
docker run -p 3000:80 ekoservice-frontend
```

## Struktur
Semua folder utama berada di `src/` dengan penamaan Bahasa Indonesia (`halaman`, `komponen`, `layanan`, `store`, `skema`, dll).

Catatan: jangan pakai file lama yang jelas cuma sisa eksperimen atau data dummy sebagai acuan flow produk sekarang. Admin aktif masih mencakup booking, keuangan, dan stok.

## Catatan Keamanan
- Tidak ada secret hardcoded
- Token disimpan via abstraction `tokenStorage`
- Interceptor menangani 401 dan error response
- UI siap CSP (lihat `index.html`)
- Hindari log sensitif di environment produksi
