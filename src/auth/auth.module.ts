import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.ts";
import { UserModule } from "../user/user.module.ts";

@Module({ controllers: [AuthController], imports: [UserModule] })
export class AuthModule {}
