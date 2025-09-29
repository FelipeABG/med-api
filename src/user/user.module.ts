import { Module } from "@nestjs/common";
import { UserService } from "./user.service.ts";

@Module({ providers: [UserService], exports: [UserService] })
export class UserModule {}
