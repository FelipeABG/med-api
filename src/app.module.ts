import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import config from "./config/config";

@Module({
    imports: [
        ConfigModule.forRoot({ load: [config], isGlobal: true }),
        AuthModule,
    ],
})
export class AppModule {}
