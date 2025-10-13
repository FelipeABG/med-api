import { Controller, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles } from "../role/role.decorator";
import { Role } from "../role/role.enum";
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserPaginationDTO } from "./dto/user-pagination.dto";

@Controller("/users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @Roles(Role.Admin)
    @ApiOperation({
        summary: "Retrieve all users.",
        description:
            "Returns a list with all the users registered in the system. **Acessible only to administrators**. If there is no users, returns am empty list.",
    })
    @ApiBearerAuth()
    @ApiOkResponse({ description: "Sucessfuly returned the list of users." })
    @ApiUnauthorizedResponse({
        description: "Only authenticated users can access this endpoint.",
    })
    @ApiForbiddenResponse({
        description: "Only **administrators** can access this endpoint.",
    })
    async findAll(@Query() userPaginationDTO: UserPaginationDTO) {
        return await this.userService.findAll(
            userPaginationDTO.limit,
            userPaginationDTO.offset,
        );
    }
}
