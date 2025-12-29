import { ConflictException, HttpStatus, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import {JwtService} from "@nestjs/jwt";
import {IUser, IUserPayload, SignUpUserRequestDto} from "expense-tracker-shared";
import { AuthenticatorRegistry, AuthenticatorTypes } from "./providers/authenticator";
import { OTPAuthenticator } from "./providers/otp-authenticator";
import { UserVerificationsService } from "src/users/user_verifications/user_verifications.service";
import { ConfigService } from "@nestjs/config";
// import { OTPAuthenticator } from "./providers/otp-authenticator";

@Injectable()
export class AuthService {
    @Inject()
    private readonly usersService: UsersService;


    constructor(
        private readonly configService: ConfigService,
        private readonly authenticatorRegistry: AuthenticatorRegistry,
        private jwtService: JwtService,
        private readonly usersVerificationsService: UserVerificationsService
    ) {
    }

    async signUpUser(provider: AuthenticatorTypes, data: SignUpUserRequestDto): Promise<string> {
        const user: IUser = await this.usersService.findUserByField("phone_number", data.phone_number) as IUser;
        if(user) {
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                data: null,
                errorMessage: "User with this phone number already exists"
            });
        }

        // create the user.
        const userRow = await this.usersService.create(data);
        if(!userRow) {
            throw new InternalServerErrorException("Failed to create user row.");
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
            const payload = await this.jwtService.verifyAsync<IUserPayload>(token);
            return payload;
        } catch {
             throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                data: null,
                errorMessage: "Token got revoked. Please login again!"
            });
        }
    }

    async loginUser(username: string, password: string) {
        const userData = (
            await this.usersService.findUserByField("username", username) ||
            await this.usersService.findUserByField("email", username)
        );

        if(!userData) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                data: "username",
                errorMessage: "Invalid email/username."
            })
        }

        const encryptedPassword = await this.usersService.encryptData(password);
        if(encryptedPassword != userData.password) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                data: "password",
                errorMessage: "Invalid password."
            })
        }

        // User is authenticated. Create a jwt token and send it to client.
        const jwtToken = await this.jwtService.signAsync<IUserPayload>({
            sub: userData.user_id as string,
            username: userData.username
        });

        return jwtToken;
    }
}