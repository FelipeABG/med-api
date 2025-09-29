import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DBService } from "../db/db.service.ts";
import { Prisma } from "../generated/prisma/client.ts";

@Injectable()
export class UserService {
    constructor(private dbService: DBService) {}

    async create(data: Prisma.UserCreateInput) {
        try {
            return await this.dbService.user.create({ data });
        } catch (err: any) {
            if (err.code == "P2002") {
                throw new HttpException(
                    "Duplicate email",
                    HttpStatus.BAD_REQUEST,
                );
            }

            throw err;
        }
    }
}
