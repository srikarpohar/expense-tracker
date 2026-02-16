export interface SignUpUserRequestDto {
    username: string;
    country_code: string;
    phone_number: string;
    password: string;
    email: string;
    profilePic?: File
}

export interface SignUpUserWithOtpResponseDto {
    verification_id: string;
}

export type SignUpUserResponseDto = SignUpUserWithOtpResponseDto;