import { IUserPayload } from "../models";

export interface LoginUserRequestDto {
    username: string;
    password: string;
}

export interface LoginUserResponseDto {
    payload: IUserPayload;
    token: string
}