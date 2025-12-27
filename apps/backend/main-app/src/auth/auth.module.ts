import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {JwtModule} from "@nestjs/jwt";
import {MulterModule} from "@nestjs/platform-express";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthenticatorRegistry } from "./providers/authenticator";
import { GoogleAuthenticator } from "./providers/google-authenticator";
import { OTPAuthenticator } from "./providers/otp-authenticator";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('jwt.secret'),
                signOptions: {
                    algorithm: "HS256",
                    expiresIn: config.get<number>('jwt.expiresIn') || 600
                }
            }),
            inject: [ConfigService]
        }),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                dest: config.get<string>('storage.assetsPath'),
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        AuthenticatorRegistry
    ],
    exports: [
        JwtModule
    ]
})
export class AuthModule implements OnModuleInit {
    @Inject()
    private readonly authenticatorRegistry: AuthenticatorRegistry;

    @Inject()
    private readonly configService: ConfigService;

    onModuleInit() {
        this.authenticatorRegistry.addAuthenticator("Google", new GoogleAuthenticator(this.configService));
        this.authenticatorRegistry.addAuthenticator("OTP", new OTPAuthenticator(this.configService));
    }
    
}