import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard";

@Module({
    controllers: [AuthController],
    //AuthGuard is global (the "APP_GUARD" token ensures it) but uses dependency injection,
    // so it cannot be applied in top level with app.useGlobalGuards()
    providers: [AuthService, { provide: "APP_GUARD", useClass: AuthGuard }],
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: "1 day" },
        }),
    ],
})
export class AuthModule {}
