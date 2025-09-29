import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.ts";

@Module({ imports: [ConfigModule.forRoot(), AuthModule] })
export class AppModule {}
