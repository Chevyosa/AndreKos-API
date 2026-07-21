import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async getEmptyRooms() {
    const rooms = await this.prisma.room.findMany({
      where: {
        statusKamar: 'KOSONG',
      },
    });

    return {
      listKamarKosong: rooms,
    };
  }
}
