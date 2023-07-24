import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

import * as pactum from 'pactum';
import { AuthDto } from '../src/dto';
import { CreatePetRockDto } from '../src/dto';

describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(3333);

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@test.com',
      password: 'ugly',
    };

    describe('Sign up', () => {
      it('no email error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: '123',
          })
          .expectStatus(400);
      });

      it('bad email error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: '123',
            password: '123',
          })
          .expectStatus(400);
      });

      it('no password error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'bad@bad.com',
          })
          .expectStatus(400);
      });

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('user exists error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: 'wrong',
          })
          .expectStatus(403);
      });
    });

    describe('Log in', () => {
      it('no email error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: '123',
          })
          .expectStatus(400);
      });

      it('bad email error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: '123',
            password: '123',
          })
          .expectStatus(400);
      });

      it('no password error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'bad@bad.com',
          })
          .expectStatus(400);
      });

      it('no existing user error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'notreal@man.com',
            pass: dto.password,
          })
          .expectStatus(400);
      });

      it('wrong password error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
            pass: 'wrong',
          })
          .expectStatus(400);
      });

      it('should log in', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('no token error', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
      it('invalid token error', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer bruh8429.bruh4839.bruh',
          })
          .expectStatus(401);
      });
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit', () => {
      it('no token error', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });

      it('invalid token error', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer bruh8429.bruh4839.bruh',
          })
          .expectStatus(401);
      });

      it('should edit current user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            firstName: 'oleg',
            lastName: 'olegov',
            email: 'oleg@oleg.com',
          })
          .expectStatus(200);
      });

      it('should not log in', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'test@test.com',
            password: 'ugly',
          })
          .expectStatus(403);
      });

      it('should log in', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'oleg@oleg.com',
            password: 'ugly',
          })
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('PetRocks', () => {
    const dto: CreatePetRockDto = {
      name: 'Chad',
      color: 'green',
    };

    describe('Get all (no petrocks)', () => {
      it('should get no pets', () => {
        return pactum
          .spec()
          .get('/pets')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create', () => {
      it('should create a pet rock', () => {
        return pactum
          .spec()
          .post('/pets')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('petId', 'id');
      });
    });

    describe('Get all', () => {
      it('should get all pet rocks', () => {
        return pactum
          .spec()
          .get('/pets')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get by id', () => {
      it('should get a pet rock', () => {
        return pactum
          .spec()
          .get('/pets/{id}')
          .withPathParams('id', '$S{petId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{petId}');
      });
    });

    describe('Edit by id', () => {
      it('should not edit a pet rock', () => {
        return pactum
          .spec()
          .patch('/pets/{id}')
          .withPathParams('id', '$S{petId}')
          .withHeaders({
            Authorization: 'Bearer dsafjkla.sdfadsf.adsasd',
          })
          .withBody({
            name: "Dave",
            color: "blue"
          })
          .expectStatus(401);
      });

      it('should edit a pet rock', () => {
        return pactum
          .spec()
          .patch('/pets/{id}')
          .withPathParams('id', '$S{petId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            name: "Dave",
            color: "blue"
          })
          .expectStatus(200);
      });

      it('should get a pet rock', () => {
        return pactum
          .spec()
          .get('/pets/{id}')
          .withPathParams('id', '$S{petId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('Dave')
          .expectBodyContains('blue');
      });
    });

    describe('Delete by id', () => {
      it('should delete', () => {
        return pactum
          .spec()
          .delete('/pets/{id}')
          .withPathParams('id', '$S{petId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get no pet rocks', () => {
        return pactum
          .spec()
          .get('/pets')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
