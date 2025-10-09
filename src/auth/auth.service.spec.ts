import { DBService } from "../db/db.service";
import { AuthService } from "./auth.service";
import { Test } from "@nestjs/testing";
import { UserModule } from "../user/user.module";
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";
import validate from "../config/config";

describe("AuthService test", () => {
    let authService: AuthService;
    let dbService: DBService;
    const user = { email: "test@gmail.com", password: "TestPassword_1234!" };

    beforeAll(async () => {
        const modRef = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: "APP_GUARD", useClass: AuthGuard },
            ],
            imports: [
                UserModule,
                ConfigModule.forRoot({ validate }),
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => ({
                        global: true,
                        secret: configService.get("SECRET_KEY"),
                        signOptions: { expiresIn: "1 day" },
                    }),
                }),
            ],
        }).compile();

        authService = modRef.get(AuthService);
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

    describe("signup", () => {
        it("Should register a new user in the db, returning the user object", async () => {
            let result = await authService.signUp(user.email, user.password);
            expect(result.email).toBe(user.email);
        });
        it("Should fail if the user already exists in the db", async () => {
            await authService.signUp(user.email, user.password);
            await expect(
                authService.signUp(user.email, user.password),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe("login", () => {
        it("Should log the user in the system, returning the JWT token", async () => {
            await authService.signUp(user.email, user.password);
            const result = await authService.logIn(user.email, user.password);
            expect(result.token).toBeDefined();
        });
        it("Should fail if the user does not exist in the db", async () => {
            await expect(
                authService.logIn(user.email, user.password),
            ).rejects.toThrow(NotFoundException);
        });
        it("Should fail if fail if the password is incorrect", async () => {
            await authService.signUp(user.email, user.password);
            await expect(
                authService.logIn(user.email, user.password + "fjdk"),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
