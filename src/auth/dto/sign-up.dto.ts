import { IsEmail, IsStrongPassword } from "class-validator";

export class SignUpDTO {
    @IsEmail()
    email: string;
    @IsStrongPassword()
    password: string;
}
