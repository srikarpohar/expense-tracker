import { SignUpUserRequestDto } from "expense-tracker-shared";
import { IAuthenticator } from "./authenticator";
import { ConfigService } from "@nestjs/config";
import { FirebaseApp, initializeApp } from "firebase/app";

export class GoogleAuthenticator implements IAuthenticator<SignUpUserRequestDto, string> {
    private readonly firebaseApp: FirebaseApp;
    constructor(
        private readonly configService: ConfigService
    ) {
        this.firebaseApp = initializeApp({
            apiKey: this.configService.get<string>('firebase.apiKey'),
            authDomain: this.configService.get<string>('firebase.authDomain'),
            projectId: this.configService.get<string>('firebase.projectId'),
            storageBucket: this.configService.get<string>('firebase.storageBucket'),
            messagingSenderId: this.configService.get<string>('firebase.messagingSenderId'),
            appId: this.configService.get<string>('firebase.appId'),
            measurementId: this.configService.get<string>('firebase.measurementId')
        });
    }

    async generateToken(payload: any): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(payload);
        return "";
    }

    async verifyToken(token: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(token);
        return false;
    }

    async invalidateToken(token: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(token);
    }

}