import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Memproses booking kamar dan mendapatkan URL pembayaran' })
  async createBooking(@Body() body: { idKamar: string }) {
    return this.bookingsService.processBooking(body.idKamar);
  }
}
