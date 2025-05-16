import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { Status } from '../src/common/enums/status.enum';
import { Role } from '../src/common/enums/role.enum';

describe('Admin (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get(getConnectionToken());
    await app.init();
  });

  beforeEach(async () => {
    // Clean the users collection before each test
    await connection.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  describe('Admin Management', () => {
    const testAdmin = {
      email: 'test@example.com',
      password: 'Password123!',
      status: Status.invited,
      roles: [Role.user],
    };

    it('/users (POST) - should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(testAdmin)
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe(testAdmin.email);
          expect(res.body.status).toBe(Status.invited);
          expect(res.body.roles).toEqual(expect.arrayContaining([Role.user]));
          expect(res.body.password).toBeUndefined(); // Password should not be returned
        });
    });

    it('/users/:id (GET) - should get user by id', async () => {
      // First create a user
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(testAdmin);

      // Then try to get the user
      return request(app.getHttpServer())
        .get(`/users/${createResponse.body._id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(testAdmin.email);
        });
    });

    it('/users/email/:email (GET) - should get user by email', async () => {
      // First create a user
      await request(app.getHttpServer())
        .post('/users')
        .send(testAdmin);

      // Then try to get the user by email
      return request(app.getHttpServer())
        .get(`/users/email/${testAdmin.email}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(testAdmin.email);
        });
    });

    it('/users/:email (PATCH) - should update user', async () => {
      // First create a user
      await request(app.getHttpServer())
        .post('/users')
        .send(testAdmin);

      const updateData = {
        status: Status.accepted,
        twoFactorEnabled: true,
      };

      // Then update the user
      return request(app.getHttpServer())
        .patch(`/users/${testAdmin.email}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(Status.accepted,);
          expect(res.body.twoFactorEnabled).toBe(true);
        });
    });

    it('should handle non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/nonexistent@example.com')
        .expect(404);
    });
  });
});