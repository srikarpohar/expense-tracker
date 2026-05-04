import { Inject, Injectable } from '@nestjs/common';
import type { IUserTransaction } from 'expense-tracker-types';
import { PgDatabaseConnectionService } from 'src/shared/database/db.connection';

@Injectable()
export class UserTransactionsService {
    @Inject()
    private readonly dbConnection!: PgDatabaseConnectionService;

    constructor() {}

    async createUserTransaction(
        userTransactionDoc: IUserTransaction
    ) {
        const userTransaction = await this.dbConnection.sqlInstance`
            INSERT INTO user_transactions
            ${this.dbConnection.sqlInstance(userTransactionDoc, ["expense_id", "user_id", "transaction_type", "is_recurring_expense", "amount"])}
            RETURNING *;
        `;

        return userTransaction.at(0);
    }

}
