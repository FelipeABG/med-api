import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { isEmail } from "class-validator";

@Injectable()
export class ParseEmailPipe implements PipeTransform {
    transform(value: string) {
        if (!isEmail(value)) {
            throw new BadRequestException("email must be an email");
        }
        return value;
    }
}
