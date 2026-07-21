import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 1. Seed Admin User
  const adminEmail = 'febriyann.personal@gmail.com';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: { email: adminEmail, nama: 'Febriyann', role: 'ADMIN' }
  });
  console.log(`Admin user created: ${admin.email}`);

  await prisma.room.upsert({
    where: { nomorKamar: '31' },
    update: {},
    create: {
      idKamar: 'K-01',
      nomorKamar: '31',
      statusKamar: 'TERISI',
      hargaKamar: 600000,
      tipePembayaran: 'CASH',
      namaPenghuni: 'Haris Dzul Baskoro',
      idPenghuni: 'USR-001',
      statusBayarBulanIni: 'BELUM_BAYAR',
      tanggalJatuhTempo: '25 Juli 2026',
    },
  });

  await prisma.room.upsert({
    where: { nomorKamar: '32' },
    update: {},
    create: {
      idKamar: 'K-02',
      nomorKamar: '32',
      statusKamar: 'TERISI',
      hargaKamar: 700000,
      tipePembayaran: 'DIGITAL',
      namaPenghuni: 'Budi',
      idPenghuni: 'USR-002',
      statusBayarBulanIni: 'LUNAS',
      tanggalJatuhTempo: '28 Juli 2026',
    },
  });

  await prisma.room.upsert({
    where: { nomorKamar: '33' },
    update: {},
    create: {
      idKamar: 'K-03',
      nomorKamar: '33',
      statusKamar: 'KOSONG',
      hargaKamar: 1000000,
    },
  });

  // Seed Transaction (Clear first to avoid duplicates since no unique constraint)
  await prisma.transaction.deleteMany();
  await prisma.transaction.create({
    data: {
      id: 'TRX-1',
      tipe: 'DIGITAL',
      nominal: 1000000,
      tanggal: '20 Juli 2026',
      deskripsi: 'Pembayaran kamar 35 via BCA',
    },
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
