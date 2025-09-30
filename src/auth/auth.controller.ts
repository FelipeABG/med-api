import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.ts";
import { SignUpDTO } from "./dto/sign-up.dto.ts";
import { Public } from "./auth.decorator.ts";

@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/login")
    @Public()
    login() {
        return;
    }

    @Post("/signup")
    @Public()
    async signup(@Body() signUpDTO: SignUpDTO) {
        return await this.authService.signUp(
            signUpDTO.email,
            signUpDTO.password,
        );
    }
}
