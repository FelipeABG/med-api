import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { DBService } from "../db/db.service";
import { AppModule } from "../app.module";

describe("Auth endpoint", () => {
    let app: INestApplication;
    let dbService: DBService;
    const user = { email: "test@gmail.com", password: "Test_password1!" };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dbService = moduleRef.get(DBService);
        app = moduleRef.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();
    });

    beforeEach(async () => {
        // Starts a transaction before each test.
        await dbService.$executeRaw`BEGIN`;
    });

    afterEach(async () => {
        // Rollback the transaction after each test.
        await dbService.$executeRaw`ROLLBACK`;
    });

    afterAll(async () => {
        await app.close();
        await dbService.$disconnect();
    });

    describe("/auth/signup Signup endpoint", () => {
        it("/POST should create an user in the db, returing the user data with 201 http code", async () => {
            return request(app.getHttpServer())
                .post("/auth/signup")
                .send(user)
                .expect(201)
                .then((response) => {
                    expect(response.body.email).toEqual(user.email);
                });
        });
        it("/POST should fail if the user already exist in the db, returning an error with 400 http code", async () => {
            await request(app.getHttpServer()).post("/auth/signup").send(user);

            return request(app.getHttpServer())
                .post("/auth/signup")
                .send(user)
                .expect(400);
        });

        it("/POST should fail if the email is invalid, returning a 400 http code", async () => {
            return request(app.getHttpServer())
                .post("/auth/signup")
                .send({ email: "fej", password: user.password })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toEqual([
                        "email must be an email",
                    ]);
                });
        });

        it("/POST should fail if the password is invalid, returning a 400 http code", async () => {
            return request(app.getHttpServer())
                .post("/auth/signup")
                .send({ email: user.email, password: "fed" })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toEqual([
                        "password is not strong enough",
                    ]);
                });
        });

        it("/POST should fail if the password and email are invalid, returning a 400 http code", async () => {
            return request(app.getHttpServer())
                .post("/auth/signup")
                .send({ email: "fed", password: "fed" })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toEqual([
                        "email must be an email",
                        "password is not strong enough",
                    ]);
                });
        });
        // Not implemented methods
        it("/GET should return 404 http code", () => {
            return request(app.getHttpServer()).get("/auth/signup").expect(404);
        });
        it("/PUT should return 404 http code", () => {
            return request(app.getHttpServer()).put("/auth/signup").expect(404);
        });

        it("/PATCH should return 404 http code", () => {
            return request(app.getHttpServer())
                .patch("/auth/signup")
                .expect(404);
        });
        it("/DELETE should return 404 http code", () => {
            return request(app.getHttpServer())
                .delete("/auth/signup")
                .expect(404);
        });
    });

    describe("/auth/login Login endpoint", () => {
        it("/POST should log the user in, returning the jwt token with 200 http code", async () => {
            await request(app.getHttpServer()).post("/auth/signup").send(user);
            return request(app.getHttpServer())
                .post("/auth/login")
                .send(user)
                .expect(200)
                .then((response) => {
                    expect(response.body.token).toBeDefined();
                });
        });

        it("/POST should fail if the email is invalid, returning a 400 http code", async () => {
            return request(app.getHttpServer())
                .post("/auth/login")
                .send({ email: "fej", password: user.password })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toEqual([
                        "email must be an email",
                    ]);
                });
        });

        it("/POST should fail if the password is invalid, returning a 400 http code", async () => {
            return request(app.getHttpServer())
                .post("/auth/login")
                .send({ email: user.email, password: "fed" })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toEqual([
                        "password is not strong enough",
                    ]);
                });
        });

        it("/POST should fail if the password and email are invalid, returning a 400 http code", async () => {
            return request(app.getHttpServer())
                .post("/auth/login")
                .send({ email: "fed", password: "fed" })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toEqual([
                        "email must be an email",
                        "password is not strong enough",
                    ]);
                });
        });

        it("/POST should fail if the user password is incorrect, returning 401 http code", async () => {
            await request(app.getHttpServer()).post("/auth/signup").send(user);
            return request(app.getHttpServer())
                .post("/auth/login")
                .send({ email: user.email, password: user.password + "x" })
                .expect(401);
        });

        it("/POST should fail if the user does not exist in the db, returning 404 http code", async () => {
            return request(app.getHttpServer())
                .post("/auth/login")
                .send(user)
                .expect(404);
        });

        // Not implemented methods
        it("/GET should return 404 http code", () => {
            return request(app.getHttpServer()).get("/auth/login").expect(404);
        });
        it("/PUT should return 404 http code", () => {
            return request(app.getHttpServer()).put("/auth/login").expect(404);
        });

        it("/PATCH should return 404 http code", () => {
            return request(app.getHttpServer())
                .patch("/auth/login")
                .expect(404);
        });
        it("/DELETE should return 404 http code", () => {
            return request(app.getHttpServer())
                .delete("/auth/login")
                .expect(404);
        });
    });
});
