import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsOptional, IsPositive, Min } from "class-validator";

@ApiSchema({
    name: "Pagination",
    description: "DTO used to describe pagination query string.",
})
export class UserPaginationDTO {
    @IsOptional()
    @IsPositive()
    @ApiProperty({
        description:
            "Specifies how many records to retrieve. It must be a positive integer. If no value is provided, **100** will be the default value.",
        required: false,
        example: 300,
    })
    limit: number = 100;

    @IsOptional()
    @Min(0)
    @ApiProperty({
        description:
            "Specifies how many records to skip. It must be a non-negative integer. If no value is provided, **0** will be the default value.",
        required: false,
        example: 10,
    })
    offset: number = 0;
}
