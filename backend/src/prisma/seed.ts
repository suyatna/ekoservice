import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hapus data demo lama yang sudah tidak dipakai UI sekarang
  await prisma.sparepart.deleteMany({
    where: {
      idTampilan: {
        in: [
          'SP-000001',
          'SP-000002',
          'SP-000003',
          'SP-000004',
          'SP-000005',
          'SP-000006',
          'SP-000007',
          'SP-000008',
        ],
      },
    },
  });

  // Admin user aktif
  const adminHash = await argon2.hash('Eko26!Aa', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  await prisma.user.upsert({
    where: { username: 'ekoserviceterbaik' },
    update: {
      username: 'ekoserviceterbaik',
    },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      nama: 'Administrator',
      username: 'ekoserviceterbaik',
      password: adminHash,
      role: 'ADMIN',
      aktif: true,
    },
  });

  console.log('✅ Admin user created: ekoserviceterbaik / Eko26!Aa');
  console.log('✅ Demo sparepart data lama dihapus');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
