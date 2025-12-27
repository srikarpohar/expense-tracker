export interface IAuthenticator<P, T = string> {
    generateToken(payload: P): Promise<T>;
    verifyToken(verification_id: string, token: T): Promise<boolean>;
    invalidateToken(token: T): Promise<void>;
}

export type AuthenticatorTypes = "OTP" | "Google";

export class AuthenticatorRegistry {
    private authenticators: Map<AuthenticatorTypes, IAuthenticator<any, any>> = new Map();

    constructor() {}

    addAuthenticator(type: AuthenticatorTypes, authenticator: IAuthenticator<any, any>): void {
        this.authenticators.set(type, authenticator);
    }

    getAuthenticator<T extends AuthenticatorTypes>(type: T): IAuthenticator<any, any> | undefined {
        return this.authenticators.get(type);
    }

    getAllAuthenticators(): Map<AuthenticatorTypes, IAuthenticator<any, any>> {
        return this.authenticators;
    }
}