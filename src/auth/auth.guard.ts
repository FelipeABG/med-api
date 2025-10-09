import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Skips authentication if the route is marked as public (/auth/login and /auth/signup)
        if (this.reflector.get("isPublic", context.getHandler())) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromRequest(req);

        if (!token) {
            throw new UnauthorizedException("User not authenticated");
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get("SECRET_KEY"),
            });
            req["user"] = payload;
        } catch (err) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromRequest(req: Request): string | undefined {
        const [type, token] = req.headers.authorization?.split(" ") ?? [];
        return type == "Bearer" ? token : undefined;
    }
}
