import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import validate from "./config/config";
import { AuthGuard } from "./auth/auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { RoleGuard } from "./role/role.guard";

@Module({
    //AuthGuard is global (the "APP_GUARD" token ensures it) but uses dependency injection,
    // so it cannot be applied in top level with app.useGlobalGuards()
    providers: [
        { provide: "APP_GUARD", useClass: AuthGuard },
        { provide: "APP_GUARD", useClass: RoleGuard },
    ],
    imports: [ConfigModule.forRoot({ validate }), AuthModule, JwtModule],
})
export class AppModule {}
