import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { DBService } from "../db/db.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(private dbService: DBService) {}

    async create(data: Prisma.UserCreateInput) {
        try {
            return await this.dbService.user.create({ data });
        } catch (err: any) {
            if (err.code == "P2002") {
                throw new BadRequestException(err, "Email already exists");
            }
            throw err;
        }
    }

    async findOne(unique: Prisma.UserWhereUniqueInput) {
        try {
            return await this.dbService.user.findUniqueOrThrow({
                where: unique,
            });
        } catch (err: any) {
            if (err.code == "P2025") {
                throw new NotFoundException(err, "User not found");
            }
            throw err;
        }
    }

    async findAll() {
        return this.dbService.user.findMany();
    }

    async deleteOne(unique: Prisma.UserWhereUniqueInput) {
        try {
            return await this.dbService.user.delete({ where: unique });
        } catch (err) {
            if (err.code == "P2025") {
                throw new NotFoundException(err, "User not found");
            }
            throw err;
        }
    }
}
