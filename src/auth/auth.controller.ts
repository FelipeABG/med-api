import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto";
import { Public } from "./auth.decorator";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    @Public()
    @ApiOperation({
        summary: "Log a user in the system.",
        description:
            "Authenticate user with email and password, returning the JWT token.",
    })
    @ApiOkResponse({ description: "Successfully authenticated." })
    @ApiBadRequestResponse({
        description: "Either password and/or email is invalid.",
    })
    @ApiUnauthorizedResponse({
        description: "Password is incorrect.",
    })
    @ApiNotFoundResponse({
        description: "User email not found in the database.",
    })
    login(@Body() authDto: AuthDTO) {
        return this.authService.logIn(authDto.email, authDto.password);
    }

    @Post("/signup")
    @HttpCode(HttpStatus.CREATED)
    @Public()
    @ApiOperation({
        summary: "Register a new user in the system.",
        description:
            "Register a new user with email and password, returning the user object. **NOTE**: Go to AuthDTO schema to see password and email constraints.",
    })
    @ApiCreatedResponse({
        description: "The user has been successfuly created.",
    })
    @ApiBadRequestResponse({
        description: "Either password and/or email is invalid.",
    })
    async signup(@Body() authDTO: AuthDTO) {
        return await this.authService.signUp(authDTO.email, authDTO.password);
    }
}
