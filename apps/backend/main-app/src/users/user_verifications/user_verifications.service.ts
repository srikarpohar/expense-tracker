import { Inject, Injectable } from '@nestjs/common';
import { UserVerificationStatus } from 'expense-tracker-shared';
import postgres from 'postgres';
import { PgDatabaseConnectionService } from 'src/shared/database/db.connection';

@Injectable()
export class UserVerificationsService {
    @Inject()
    private readonly dbConnection: PgDatabaseConnectionService;

    async createUserSignupVerificationEntry(userId: string): Promise<postgres.Row | undefined> {
        const entry = await this.dbConnection.sqlInstance`
            INSERT INTO user_signup_verifications
            ${this.dbConnection.sqlInstance({ 
                user_id: userId, 
                verification_status: UserVerificationStatus.OTP_SENT, 
                no_of_attempts: 0 
            })}
            RETURNING *;
        `;
        return entry.at(0);
    }

    async updateVerificationStatus(userId: string, verification_id: string, status: UserVerificationStatus): Promise<void> {
        await this.dbConnection.sqlInstance`
            UPDATE user_signup_verifications
            SET verification_status = ${status}
            WHERE user_id = ${userId} AND verification_id = ${verification_id};
        `;
    }
}
