import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Admin Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Mendapatkan data agregasi lengkap untuk Dashboard Admin' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Post('payout')
  @ApiOperation({ summary: 'Mencairkan Saldo Digital (Withdraw)' })
  async payout(@Body() body: { nominal: number }) {
    return this.adminService.payout(body.nominal);
  }
}
