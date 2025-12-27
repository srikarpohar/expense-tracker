import { ConfigService } from "@nestjs/config";
import { IAuthenticator } from "./authenticator";
import twilio, { type Twilio } from "twilio";
import { InternalServerErrorException } from "@nestjs/common";

export class OTPAuthenticator implements IAuthenticator<string, string> {
    private readonly twilioClient: Twilio;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.twilioClient = twilio(
            this.configService.get<string>('sms.twilio.accountSid'),
            this.configService.get<string>('sms.twilio.authToken')
        );
    }

    async generateToken(payload: string): Promise<string> {
        try {
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(otpCode, payload, this.configService.get<string>('sms.twilio.accountSid') as string);
            const verification = await this.twilioClient.verify.v2
                .services(this.configService.get<string>('sms.twilio.verifyServiceId') as string)
                .verifications.create({ 
                    to: payload, 
                    channel: 'sms',
                    customCode: otpCode
                    // Below options not allowed in free version
                    // customFriendlyName: "Expense tracker",
                });
            
            
            console.log(`Verification sent: ${verification.sid} with OTP: ${otpCode} to ${payload}`);
            return verification.sid;
        } catch (error: unknown) {
            console.error("Error generating OTP:", (error as Error).message);
            throw new InternalServerErrorException("Failed to generate OTP");
        }
    }

    async verifyToken(verification_id: string, token: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(verification_id, token);
        return false;
    }

    async invalidateToken(token: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(token);
    }

}