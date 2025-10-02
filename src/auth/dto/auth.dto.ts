import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

@ApiSchema({
    name: "Sign Up DTO",
    description:
        "DTO used to describe authentication expected request body content",
})
export class AuthDTO {
    @IsEmail()
    @ApiProperty({
        description:
            "User's unique email address. Must be a valid email address.",
        example: "user123@gmail.com",
    })
    email: string;
    @IsStrongPassword()
    @ApiProperty({
        description: `User's password for authentication. Must meet strong password requirements:
                      8 characters, 1 lowercase character, 1 uppercase character, 1 digit and 1 symbol.`,
        example: "Your_Password123!",
    })
    password: string;
}
