import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { DBModule } from "../db/db.module";

@Module({
    providers: [UserService],
    exports: [UserService],
    imports: [DBModule],
})
export class UserModule {}
