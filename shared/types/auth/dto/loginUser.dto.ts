export interface LoginUserRequestDto {
    username: string;
    password: string;
}

export interface LoginUserResponseDto {
    token: string
}