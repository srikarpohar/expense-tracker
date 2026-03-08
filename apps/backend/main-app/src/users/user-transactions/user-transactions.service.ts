import { Injectable } from '@nestjs/common';
import { IUserTransaction } from 'expense-tracker-shared';
import { PgDatabaseConnectionService } from 'src/shared/database/db.connection';

@Injectable()
export class UserTransactionsService {

    constructor(
        private dbConnection: PgDatabaseConnectionService
    ) {}

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
