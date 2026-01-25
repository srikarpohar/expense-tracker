import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import {JwtService} from "@nestjs/jwt";
import { IUser, IUserPayload, SignUpUserRequestDto} from "expense-tracker-shared";
import { AuthenticatorRegistry, AuthenticatorTypes } from "./providers/authenticator";
import { OTPAuthenticator } from "./providers/otp-authenticator";
import { UserVerificationsService } from "src/users/user_verifications/user_verifications.service";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "src/shared/logger/logger.service";

@Injectable()
export class AuthService {
    @Inject()
    private readonly usersService: UsersService;

    @Inject()
    private readonly logger: LoggerService;

    constructor(
        private readonly configService: ConfigService,
        private readonly authenticatorRegistry: AuthenticatorRegistry,
        private jwtService: JwtService,
        private readonly usersVerificationsService: UserVerificationsService
    ) {
    }

    async signUpUser(provider: AuthenticatorTypes, data: SignUpUserRequestDto): Promise<string> {
        this.usersService.validateUserPhoneNumber(data.phone_number, data.country_code);
        const user: IUser = await this.usersService.findUserByField("phone_number", data.phone_number) as IUser;
        if(user) {
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                data: null,
                errorMessage: "User with this phone number already exists"
            });
        }
        
        // TODO: Use transactions to create user, send otp and then create verification row. Rollback even if one step fails.
        // create the user.
        const userRow = await this.usersService.create(data);
        if(!userRow) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                data: null,
                errorMessage: "An unexpected error occurred. Please try again later."
            });
        }

        let verification_id = "123"; // In real scenario, this would be the id returned by the OTP service.

        // OTP Authentication mechanism
        if(this.configService.get<string>('sms.enable')) {
            const authenticator: any = this.authenticatorRegistry.getAuthenticator<AuthenticatorTypes>(provider);
            verification_id = await (authenticator as OTPAuthenticator)?.generateToken(`${data.country_code}${data.phone_number}`) ?? "";
        }
        
        // create verification entry row in db table.
        await this.usersVerificationsService.createUserSignupVerificationEntry(userRow.user_id as string);

        return verification_id;
    }

    async verifyOtp(verification_id: string, otp_code: string): Promise<boolean> {
        const authenticator: any = this.authenticatorRegistry.getAuthenticator<AuthenticatorTypes>("OTP");
        const isVerified = await (authenticator as OTPAuthenticator)?.verifyToken(verification_id, otp_code);
        return isVerified;
    }

    async verifyToken(token: string): Promise<IUserPayload> {
        try {
            const payload = await this.jwtService.verifyAsync<IUserPayload>(token, {
                secret: this.configService.get<string>('jwt.secret'),
                algorithms: ["HS256"],
            });
            return payload;
        } catch(error) {
            this.logger.error(error.message as string);
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                data: {
                    retry: true
                },
                errorMessage: "Token got revoked. Please login again!"
            });
        }
    }

    async loginUser(username: string, password: string): Promise<{payload: IUserPayload, token: string}> {
        const userData = (
            await this.usersService.findUserByField("username", username) ||
            await this.usersService.findUserByField("email", username)
        );

        if(!userData) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                data: null,
                errorMessage: "Invalid credentials"
            })
        }

        const passwordMatch = await this.usersService.comparePassword(password, userData.password);
        if(!passwordMatch) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                data: null,
                errorMessage: "Invalid credentials"
            })
        }

        // User is authenticated. Create a jwt token and send it to client.
        const payload: IUserPayload = this.usersService.getJwtPayload(userData);
        const jwtToken = await this.jwtService.signAsync<IUserPayload>(payload);

        return {payload, token: jwtToken};
    }
}