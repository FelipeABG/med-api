import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "../user/user.service.ts";
import { CreateUserDTO } from "../user/dto/create-user.dto.ts";

@Controller("/auth")
export class AuthController {
    constructor(private userService: UserService) {}
    @Post("/login")
    login() {
        return;
    }

    @Post("/signup")
    signup(@Body() user: CreateUserDTO) {
        return this.userService.create({
            email: user.email,
            hash: user.password,
        });
    }
}
