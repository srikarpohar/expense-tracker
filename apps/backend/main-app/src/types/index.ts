import { HttpStatus } from "@nestjs/common";

export interface ResponseDto<T> {
    data: T | null;
    statusCode: HttpStatus;
    errorMessage?: string;
}