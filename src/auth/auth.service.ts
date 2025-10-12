import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(email: string, password: string) {
        const hash = await bcrypt.hash(password, 10);
        // If the email exists, throws bad request exception
        return await this.userService.create({ email, hash });
    }

    async logIn(email: string, password: string) {
        // If the user does not exist, throws not found exception
        const user = await this.userService.findOne({ email });

        const match = await bcrypt.compare(password, user.hash);
        if (!match) {
            // If the password does not match, throw an Unauthorized expecption
            throw new UnauthorizedException("Incorrect password");
        }

        // Creates a new token for the user and returns it
        return {
            token: await this.jwtService.signAsync({
                sub: user.id,
                email: user.email,
                roles: user.roles,
            }),
        };
    }
}
