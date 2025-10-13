import { Test } from "@nestjs/testing";
import { UserService } from "./user.service";
import { DBModule } from "../db/db.module";
import { DBService } from "../db/db.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("UserService Test", () => {
    let userService: UserService;
    let dbService: DBService;
    const user = { email: "test@gmail.com", hash: "fajlskfd;sjeorhih" };

    beforeAll(async () => {
        const modRef = await Test.createTestingModule({
            providers: [UserService],
            imports: [DBModule],
        }).compile();

        userService = modRef.get(UserService);
        dbService = modRef.get(DBService);
    });

    beforeEach(async () => {
        // Starts a transaction before each test.
        await dbService.$executeRaw`BEGIN`;
    });

    afterEach(async () => {
        // Rollback the transaction after each test.
        await dbService.$executeRaw`ROLLBACK`;
    });

    afterAll(() => {
        dbService.$disconnect();
    });

    describe("create", () => {
        it("Should create a user in the db and return the user object", async () => {
            const result = await userService.create(user);
            expect(result.email).toBe(user.email);
            expect(result.hash).toBe(user.hash);
        });

        it("Should fail if the given email already exists on the database", async () => {
            await userService.create(user);
            await expect(userService.create(user)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe("findOne", () => {
        it("Should find the user with the corresponding unique argument", async () => {
            await userService.create(user);
            const result = await userService.findOne({ email: user.email });
            expect(result.email).toBe(user.email);
        });

        it("Should fail if the user does not exist", async () => {
            await expect(
                userService.findOne({ email: user.email }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe("findAll", () => {
        it("Should return all the users from the db", async () => {
            await userService.create(user);
            await userService.create({ email: "fkljads", hash: "akdljfsd" });
            const result = await userService.findAll(100, 0);
            expect(result.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("deleteOne", () => {
        it("Should delete a user uniquely identified", async () => {
            await userService.create(user);
            const response = await userService.deleteOne({ email: user.email });
            expect(response.email).toBe(user.email);
        });

        it("Should fail if the user does not exist", async () => {
            await expect(
                userService.deleteOne({ email: user.email }),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
