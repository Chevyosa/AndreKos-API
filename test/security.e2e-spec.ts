import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('Security E2E Tests (Satpam Checker)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Penting: Samakan prefix global seperti di main.ts
    app.setGlobalPrefix('api'); 
    await app.init();
    
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. GET /api/rooms/empty - Boleh diakses publik tanpa login (Status 200 OK)', () => {
    return request(app.getHttpServer())
      .get('/api/rooms/empty')
      .expect(200);
  });

  it('2. POST /api/bookings - Harus ditolak jika tanpa token JWT (Status 401 Unauthorized)', () => {
    return request(app.getHttpServer())
      .post('/api/bookings')
      .send({ idKamar: 'K-03' })
      .expect(401);
  });

  it('3. GET /api/admin/dashboard - Harus ditolak jika tanpa token JWT (Status 401 Unauthorized)', () => {
    return request(app.getHttpServer())
      .get('/api/admin/dashboard')
      .expect(401);
  });

  it('4. GET /api/admin/dashboard - Harus ditolak jika bawa token asli tapi rolenya ANAK_KOS (Status 403 Forbidden)', () => {
    // Kita membuat JWT asli yang disahkan oleh sistem kita, tapi role-nya Anak Kos
    const anakKosToken = jwtService.sign({ sub: 'USR-TEST', email: 'penyusup@gmail.com', role: 'ANAK_KOS' });

    return request(app.getHttpServer())
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${anakKosToken}`) // Bawa token sebagai Bearer header
      .expect(403);
  });
});
