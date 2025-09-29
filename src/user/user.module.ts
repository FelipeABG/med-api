import { Module } from "@nestjs/common";
import { UserService } from "./user.service.ts";
import { DBModule } from "../db/db.module.ts";

@Module({
    providers: [UserService],
    exports: [UserService],
    imports: [DBModule],
})
export class UserModule {}
