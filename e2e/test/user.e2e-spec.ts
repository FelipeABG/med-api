import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DBService } from "../../src/db/db.service";
import { AppModule } from "../../src/app.module";
import { UserService } from "../../src/user/user.service";
import * as bcrypt from "bcryptjs";
import * as request from "supertest";
import { Role } from "@prisma/client";

interface Actor {
    email: string;
    password: string;
}

describe("Users endpoint", () => {
    let app: INestApplication;
    let dbService: DBService;
    let userService: UserService;

    let adminToken: string;
    let admin: Actor;

    let userToken: string;
    let user: Actor;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dbService = moduleRef.get(DBService);
        userService = moduleRef.get(UserService);
        app = moduleRef.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        //Creates both an admin and a normal user for tests
        admin = {
            email: "adminuseremail@gmail.com",
            password: "Thisisthe@admin1004!",
        };
        user = {
            email: "useruseremail@gmail.com",
            password: "Thisisthe@user1009!",
        };

        const hashAdmin = await bcrypt.hash(admin.password, 10);
        await userService.create({
            email: admin.email,
            hash: hashAdmin,
            roles: [Role.Admin],
        });
        const userHash = await bcrypt.hash(user.password, 10);
        await userService.create({
            email: user.email,
            hash: userHash,
        });

        adminToken = await request(app.getHttpServer())
            .post("/auth/login")
            .send(admin)
            .expect(200)
            .then((response) => response.body.token);

        userToken = await request(app.getHttpServer())
            .post("/auth/login")
            .send(user)
            .expect(200)
            .then((response) => response.body.token);
    });

    beforeEach(async () => {
        await dbService.$executeRaw`BEGIN`;
    });

    afterEach(async () => {
        await dbService.$executeRaw`ROLLBACK`;
    });

    afterAll(async () => {
        await userService.deleteOne({ email: admin.email });
        await userService.deleteOne({ email: user.email });
        await app.close();
        await dbService.$disconnect();
    });

    describe("GET /users", () => {
        it("should return a list of all users with 200 status code", async () => {
            return request(app.getHttpServer())
                .get("/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200)
                .then((response) => {
                    expect(Array.isArray(response.body)).toBe(true);
                });
        });

        it("should return 401 when user is not authenticated", async () => {
            return request(app.getHttpServer()).get("/users").expect(401);
        });

        it("should return 403 when user lacks admin role", async () => {
            return request(app.getHttpServer())
                .get("/users")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403);
        });
    });

    describe("DELETE /users/:id", () => {
        it("should delete user by id and return 204 status code", async () => {
            const randomUser = {
                email: `user-${Date.now()}@gmail.com`,
                password: "Test_password1!",
            };

            const userId = await request(app.getHttpServer())
                .post("/auth/signup")
                .send(randomUser)
                .expect(201)
                .then((response) => response.body.id);

            return request(app.getHttpServer())
                .delete(`/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(204);
        });

        it("should return 404 when user does not exist", async () => {
            return request(app.getHttpServer())
                .delete("/users/9999999")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(404);
        });

        it("should return 401 when user is not authenticated", async () => {
            return request(app.getHttpServer())
                .delete("/users/9999999")
                .expect(401);
        });

        it("should return 403 when user lacks admin role", async () => {
            return request(app.getHttpServer())
                .delete("/users/1")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403);
        });
    });
});
