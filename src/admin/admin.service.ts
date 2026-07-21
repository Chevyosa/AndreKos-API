import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const rooms = await this.prisma.room.findMany();
    const transactions = await this.prisma.transaction.findMany({
      // SQLite/Prisma mock sorting hack: we're using strings for date, so sort won't be perfect, but it's ok for MVP.
    });

    const totalKamar = rooms.length;
    const totalKamarTerisi = rooms.filter(r => r.statusKamar === 'TERISI').length;
    const totalKamarKosong = rooms.filter(r => r.statusKamar === 'KOSONG').length;
    
    const jumlahPenghuni = totalKamarTerisi;
    const pemasukanBulanIni = transactions
      .filter(t => t.tipe === 'DIGITAL' || t.tipe === 'CASH')
      .reduce((sum, t) => sum + t.nominal, 0);

    const saldoDigital = transactions
      .filter(t => t.tipe === 'DIGITAL' || t.tipe === 'WITHDRAW')
      .reduce((sum, t) => t.tipe === 'DIGITAL' ? sum + t.nominal : sum - t.nominal, 0);
      
    const saldoTunai = transactions
      .filter(t => t.tipe === 'CASH')
      .reduce((sum, t) => sum + t.nominal, 0);

    return {
      statistik: {
        totalKamar,
        totalKamarTerisi,
        totalKamarKosong,
        jumlahPenghuni,
        pemasukanBulanIni,
        totalTunggakanBulanIni: 0,
      },
      keuangan: {
        saldoDigital,
        saldoTunai,
        laporanBulanan: [
          { bulan: "Juli", pendapatanDigital: saldoDigital, pendapatanCash: saldoTunai }
        ]
      },
      daftarKamar: rooms,
      daftarPengajuanPindah: [],
      riwayatTransaksi: transactions
    };
  }

  async payout(nominal: number) {
    await this.prisma.transaction.create({
      data: {
        tipe: 'WITHDRAW',
        nominal: nominal,
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        deskripsi: 'Penarikan ke Rekening Bank'
      }
    });
    return { success: true };
  }
}
