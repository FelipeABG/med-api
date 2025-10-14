import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles } from "../role/role.decorator";
import { Role } from "../role/role.enum";
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserPaginationDTO } from "./dto/user-pagination.dto";

@Controller("/users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @Roles(Role.Admin)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Retrieve all users.",
        description:
            "Returns a list with all the users registered in the system. **Acessible only to administrators**. If there is no users, returns am empty list.",
    })
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

    @Delete(":id")
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Delete an user by id.",
        description:
            "Deletes a user identified by its id. **Accessible only to administrators**. If there is no such user, returns 404 http code.",
    })
    @ApiUnauthorizedResponse({
        description: "Only authenticated users can access this endpoint.",
    })
    @ApiNoContentResponse({
        description: "The user has been successfuly deleted.",
    })
    @ApiForbiddenResponse({
        description: "Only **administrators** can access this endpoint.",
    })
    @ApiNotFoundResponse({ description: "The user does not exist in the db." })
    @ApiParam({
        name: "id",
        description: "Unique identifier of the user to delete.",
    })
    async deleteOneById(@Param("id") id: number) {
        await this.userService.deleteOne({ id });
    }
}
