export interface VerifySignupOtpRequestDto {
    verification_id: string;
    otp_code: string;
}

export interface VerifySignupOtpResponseDto {
    isVerified: boolean;
    errorMessage?: string;
}