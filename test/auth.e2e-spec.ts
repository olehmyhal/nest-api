import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { disconnect } from "mongoose";
import { AuthDto } from "src/auth/dto/auth.dto";

const loginDto: AuthDto = {
  login: "oleh123@mail.ru",
  password: "123",
};

describe("Auth controller (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/auth/login (POST) - success", async (done) => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
        done();
      });
  });

  it("/auth/login (POST) - error password", async (done) => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...loginDto, password: 2 })
      .expect(400)
      .then(() => done());
  });

  it("/auth/login (POST) - error email", async (done) => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({ ...loginDto, login: "oleh123111@mail.ru" })
      .expect(401, {
        statusCode: 401,
        message: "User not found",
        error: "Unauthorized",
      })
      .then(() => done());
  });

  afterAll(() => {
    disconnect();
  });
});
