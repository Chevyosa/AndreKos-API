import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async verifyGoogleLogin(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const email = payload?.email;

      if (!email) {
        throw new UnauthorizedException('Token invalid');
      }

      // Check if user exists in DB
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      // Auto-register as ANAK_KOS if not exists
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: email,
            nama: payload?.name || email.split('@')[0],
            role: 'ANAK_KOS',
          }
        });
      }

      // Generate JWT
      const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

      return {
        success: true,
        accessToken,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Gagal memverifikasi token Google');
    }
  }
}
