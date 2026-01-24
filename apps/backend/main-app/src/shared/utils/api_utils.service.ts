import { BadRequestException, HttpStatus } from "@nestjs/common";
import {type Request} from "express";

export class APIUtilsService {
    extractTokenFromHeader(request: Request): string {
        const token = request.cookies["authorization_token"] || "";
        if (!token) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                data: null,
                errorMessage: "No bearer token provided"
            });
        }

        return token as string;
    }
}