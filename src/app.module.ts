import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import validate from "./config/config";

@Module({
    imports: [ConfigModule.forRoot({ validate }), AuthModule],
})
export class AppModule {}
