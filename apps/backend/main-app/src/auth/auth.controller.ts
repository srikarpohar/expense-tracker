import {Controller, Post, Res, UseInterceptors, UploadedFile, Req, Body, Get } from "@nestjs/common";
import {type Express, type Request, type Response} from "express";
import { AuthService } from "./auth.service";
import {FileInterceptor} from "@nestjs/platform-express";
import { type LoginUserRequestDto, LoginUserResponseDto, SignUpUserRequestDto, SignUpUserResponseDto, type VerifySignupOtpRequestDto, VerifySignupOtpResponseDto } from "expense-tracker-shared";
import { ResponseDto } from "src/types";
import { AuthenticatorTypes } from "./providers/authenticator";
import { ConfigService } from "@nestjs/config";
import { PublicAPIResource } from "src/shared/guards/public.decorator";

@PublicAPIResource()
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    @Post("signup")
    @UseInterceptors(FileInterceptor('profile_pic'))
    async signUpUser(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request<{provider: string}, any, SignUpUserRequestDto>,
        @Res() res: Response<ResponseDto<SignUpUserResponseDto>>
    ) {
        const { body, params: { provider } } = req;

        const verification_id = await this.authService.signUpUser(provider as AuthenticatorTypes, body);

        res.status(201).send({
            data: { verification_id },
            statusCode: 201
        });
    }

    @Get("verify-otp")
    async verifyOtp(
        @Body() body: VerifySignupOtpRequestDto,
        @Res() res: Response<ResponseDto<VerifySignupOtpResponseDto>>
    ) {
        const isVerified = await this.authService.verifyOtp(body.verification_id, body.otp_code);

        res.status(200).send({
            data: { isVerified, errorMessage: isVerified ? undefined : "Invalid OTP code" },
            statusCode: 200
        });
    }

    @Post("login")
    async loginUser(
        @Body() body: LoginUserRequestDto,
        @Res() res: Response<ResponseDto<LoginUserResponseDto>>
    ) {
        const token = await this.authService.loginUser(
            body.username, 
            body.password
        );

        res.cookie("authorization_token", token, {
            maxAge: (this.configService.get<number>("jwt.expiresIn") || 600) * 1000,
            httpOnly: true,
            secure: true,
        })
        res.status(201).send({
            data: {token},
            statusCode: 201
        })
    }

}