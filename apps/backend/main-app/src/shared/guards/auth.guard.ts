import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IS_PUBLIC_API } from "./public.decorator";
import { AuthService } from "src/auth/auth.service";
import { APIUtilsService } from "../utils/api_utils.service";

@Injectable()
export class AuthGaurd implements CanActivate {
    
    constructor(
        private apiUtilsService: APIUtilsService,
        private authService: AuthService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_API, [
            context.getHandler(),
            context.getClass()
        ])
        if(isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const token = this.apiUtilsService.extractTokenFromHeader(request);

        const payload = await this.authService.verifyToken(token);
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request["user"] = payload;

        return true;
    }
}