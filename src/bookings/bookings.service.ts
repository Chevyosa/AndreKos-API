import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async processBooking(idKamar: string) {
    // In a real app, this would integrate with Midtrans/Xendit
    // and create a booking record in DB.
    
    // For now, return mock data exactly like the frontend expects:
    return {
      success: true,
      paymentUrl: "https://app.sandbox.midtrans.com/snap/v2/vtweb/123456",
      bookingId: "B-999",
    };
  }
}
