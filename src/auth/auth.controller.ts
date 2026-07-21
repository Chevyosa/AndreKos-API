import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @ApiOperation({ summary: 'Login menggunakan Google ID Token' })
  async googleLogin(@Body() body: { idToken: string }) {
    return this.authService.verifyGoogleLogin(body.idToken);
  }
}
