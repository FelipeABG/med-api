import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./role.enum";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const endpointRoles: Role[] = this.reflector.get(
            "roles",
            context.getHandler(),
        );

        // Endpoint not protected by roles
        if (!endpointRoles) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const userRoles = req.user.roles;

        return endpointRoles.some((role) => userRoles.include(role));
    }
}
