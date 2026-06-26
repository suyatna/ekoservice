-- ============================================================
-- EkoService Database Seed
-- Seed ini sengaja minimal.
-- Hanya menyiapkan admin awal. Data demo sparepart dan user
-- lain sudah tidak dipakai lagi.
-- ============================================================

INSERT INTO "users" (
  "id",
  "nama",
  "username",
  "email",
  "password",
  "role",
  "aktif",
  "dibuatDi"
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Administrator',
  'ekoserviceterbaik',
  'admin@ekoservice.com',
  '$argon2id$v=19$m=65536,t=3,p=4$9kto8mOP5DPZtvhoz6c+Dw$ktWZFFGf1qnHTboDykV+/dRJFa0ZnxzDq3RCiwcaprk',
  'ADMIN',
  true,
  NOW()
) ON CONFLICT (email) DO UPDATE SET "username" = 'ekoserviceterbaik';
