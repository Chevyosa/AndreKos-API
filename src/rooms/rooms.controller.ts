import { Controller, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('empty')
  @ApiOperation({ summary: 'Mendapatkan daftar kamar kosong' })
  async getEmptyRooms() {
    return this.roomsService.getEmptyRooms();
  }
}
