import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { DBModule } from "../db/db.module";
import { UserController } from "./user.controller";

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [DBModule],
})
export class UserModule {}
