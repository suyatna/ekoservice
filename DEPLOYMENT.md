# Deploy EkoService

Catatan singkat buat naik ke server. Jangan pakai password contoh dari repo untuk production.

## 1. Siapkan Server

- Install Docker dan Docker Compose plugin.
- Arahkan domain ke IP server.
- Buka port `80` dan `443`. Port database dan Redis tidak perlu dibuka ke publik.

## 2. Buat Env Production

Di server:

```bash
cp compose.env.example .env
cp backend/env.production.example backend/.env
```

Isi nilai ini di `.env` root:

- `POSTGRES_PASSWORD`
- `REDIS_PASSWORD`
- `API_KEY`

Isi nilai ini di `backend/.env`:

- `DATABASE_URL`
- `REDIS_PASSWORD`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `API_KEY`
- `APP_URL`
- `APP_FRONTEND_URL`
- `ALLOWED_ORIGINS`

Generate secret:

```bash
openssl rand -hex 64
openssl rand -hex 32
```

Pastikan `API_KEY` di `backend/.env` sama dengan nilai `VITE_API_KEY` saat frontend dibuild oleh Docker Compose.
Password Postgres dan Redis juga harus sama antara `.env` root dan `backend/.env`.

## 3. Jalankan Stack

```bash
docker compose up -d --build
```

Cek status:

```bash
docker ps
curl -i http://localhost:3000/health
```

Backend, Postgres, dan Redis harus `healthy`.

## 4. Tes Manual

- Login admin.
- Buka halaman stok, ubah data, refresh halaman.
- Kosongkan salah satu form dalam satu baris untuk tes hapus data.
- Coba booking publik.
- Coba transaksi dan export PDF.
- Logout, lalu login lagi.

## 5. SSL

Untuk domain production, pasang SSL lewat reverse proxy atau provider VPS. Kalau pakai Nginx di compose ini, taruh sertifikat di `nginx/ssl`, lalu sesuaikan `nginx/nginx.conf` untuk listen `443`.

## 6. Backup

Minimal backup volume Postgres sebelum update besar:

```bash
docker exec ekoservice_postgres pg_dump -U eko_service eko_service > backup-$(date +%F).sql
```

Simpan backup di luar server juga.
