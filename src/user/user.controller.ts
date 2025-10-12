import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles } from "../role/role.decorator";
import { Role } from "../role/role.enum";

@Controller("/users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @Roles(Role.Admin)
    async findAll() {
        return await this.userService.findAll();
    }
}
