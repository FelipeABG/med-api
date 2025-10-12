import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DBService } from "../db/db.service";
import { AppModule } from "../app.module";
import { UserService } from "./user.service";
import * as bcrypt from "bcryptjs";
import * as request from "supertest";
import { Role } from "@prisma/client";

describe("Users endpoint", () => {
    let app: INestApplication;
    let dbService: DBService;
    let userService: UserService;

    const user = { email: "test@gmail.com", password: "Test_password1!" };
    const adminUser = {
        email: "test_admin@gmail.com",
        password: "Test_password2!",
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dbService = moduleRef.get(DBService);
        userService = moduleRef.get(UserService);
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

    describe("/user endpoint", () => {
        it("/GET Should return a list of all users registered with 200 http code", async () => {
            // create a admin user
            const hash = await bcrypt.hash(adminUser.password, 10);
            userService.create({
                email: adminUser.email,
                hash,
                roles: [Role.Admin],
            });

            // get login token
            const token = await request(app.getHttpServer())
                .post("/auth/login")
                .send(adminUser)
                .expect(200)
                .then((response) => {
                    return response.body.token;
                });

            expect(token).toBeDefined();

            //get user list
            return request(app.getHttpServer())
                .get("/users")
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                });
        });

        it("/GET should fail if the user is not authenticated, returning 401 http code", async () => {
            return request(app.getHttpServer()).get("/users").expect(401);
        });

        it("/GET should fail if the authenticated user does not have the correct role, returning 4xx http code", async () => {
            await request(app.getHttpServer())
                .post("/auth/signup")
                .send(user)
                .expect(201);

            const token = await request(app.getHttpServer())
                .post("/auth/login")
                .send(user)
                .expect(200);

            return request(app.getHttpServer())
                .get("/users")
                .set("Authorization", `Bearer ${token}`)
                .expect(401);
        });
    });
});
